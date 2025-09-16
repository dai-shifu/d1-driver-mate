/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (request.method === 'POST' && url.pathname === '/api/login') {
			const { code } = await request.json();
			if (!code) {
				return new Response('code required', { status: 400 })
			}
			// 1. 微信换取openid
			const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${env.WX_APPID}&secret=${env.WX_SECRET}&js_code=${code}&grant_type=authorization_code`);
			const wxJson = await wxRes.json();
			if (wxJson.errcode) {
				return new Response(JSON.stringify(wxJson), { status: 400 });
			}
			// {"session_key":"NbElGYdyg+dECSuJhBtx0w==","openid":"oSiTz5VnHg7LJuSQCzSO7P01c0rA"}
			const openid = wxJson.openid;

			// 2. 在user表中查找 创建
			// 查找用户
			const findRes = await env.d1_driver_mate
				.prepare('select id,openid,nickname,avatar from users where 1=1 and openid = ?')
				.bind(openid).all();

			let user;
			if (findRes.results && findRes.results.length > 0) {
				user = findRes.results[0];
			} else {
				// 创建用户
				const insertUser = await env.d1_driver_mate
					.prepare('insert into users (openid) values (?)')
					.bind(openid).run();

				const userId = insertUser.lastInsertId;

				const userRow = await env.d1_driver_mate
					.prepare('select id,openid from users where id =?')
					.bind(userId).first();

				user = userRow;

			}

			// 3 生成token , 设置过期时间30天后
			const token = generateToken();
			const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

			// 4. 保存到session表中
			await env.d1_driver_mate
				.prepare('insert into sessions (user_id,token,expires_at) values (?,?,?)')
				.bind(user.id, token, expiresAt).run();

			// 5. 返回token个客户端

			return new Response(JSON.stringify({
				token,
				expires_at: expiresAt,
				user: { id: user.id, openid: user.openid }
			}), { headers: { 'Content-Type': 'application/json' } })


		}
	},
} satisfies ExportedHandler<Env>;

function generateToken() {
	const arr = crypto.getRandomValues(new Uint8Array(32));
	let s = '';
	for (let i = 0; i < arr.length; i++) {
		s += arr[i].toString(16).padStart(2, '0');
	}
	return 'tk_' + s + '_' + Date.now().toString(36);
}