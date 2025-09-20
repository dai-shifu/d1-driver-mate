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

import { handleLogin } from './handle';
import { handleExpense, handleExpenseList ,handleVehicle,handleVehicleList} from './handle/index';

async function handleOptions(request: Request) {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type,Authorization',
			'Access-Control-Max-Age': '86400'
		}
	})
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		// 处理小程序头部返回
		if (request.method === 'Options') {
			return handleOptions(request);
		}

		if (request.method === 'POST' && url.pathname === '/api/login') {
			return handleLogin(request, env, ctx);
		}
		if (request.method === 'POST' && url.pathname === '/api/expense') {
			// token 校验
			return handleExpense(request, env, ctx);
		}

		if(request.method === 'POST' && url.pathname === '/api/expense/list'){
			return handleExpenseList(request, env, ctx);
		}

		if(request.method ==='POST' && url.pathname === '/api/vehicle'){
			return handleVehicle(request, env, ctx);
		}

		if(request.method ==='POST' && url.pathname === '/api/vehicle/list'){
			return handleVehicleList(request, env, ctx);
		}
	

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;