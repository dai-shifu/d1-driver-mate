// 新增消费信息
export const handleExpense = async (request: Request, env: Env, ctx: ExecutionContext) => {
    const body = await request.json();
    const { user_id, vehicle_id, category_id, amount, occurred_at, remark='', receipt_url='' } = body;

    // 参数校验
    if (!user_id || !vehicle_id || !category_id || !amount || !occurred_at) {
        console.log('参数错误', { user_id, vehicle_id, category_id, amount, occurred_at, remark, receipt_url });
        return new Response('参数错误', { status: 400 });
    }

    // 插入数据

    const insertExpense = await env.d1_driver_mate
        .prepare('insert into expenses (user_id,vehicle_id,category_id,amount,occurred_at,remark,receipt_url) values (?,?,?,?,?,?,?)')
        .bind(user_id, vehicle_id, category_id, amount, occurred_at, remark, receipt_url)
        .run();

    console.log('insertExpense', insertExpense);

    if (insertExpense.success) {
        return new Response('保存成功', { status: 200 });
    }

    return new Response('Expense', { status: 500 });
}

// 查询用户下的消费列表
export const handleExpenseList = async (request: Request, env: Env, ctx: ExecutionContext) => {
    const { user_id, page = 1, pageSize = 10 } = await request.json();
    // 查询列表数据
    const list = await env.d1_driver_mate
        .prepare('select * from expenses where user_id = ? order by occurred_at desc limit ? offset ?')
        .bind(user_id, pageSize, (page - 1) * pageSize)
        .run();

    if (list.success) {
        return new Response(JSON.stringify(list.results), { status: 200 })
    }

    return new Response('查询失败', { status: 500 });
}


export default {
    handleExpense,
    handleExpenseList,
}