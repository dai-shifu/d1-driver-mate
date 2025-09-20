// 添加车辆
export const handleVehicle = async (request: Request, env: Env, ctx: ExecutionContext) => {
    const body = await request.json();
    const { user_id, plate, model } = body;
    if (!user_id || !plate) {
        return new Response('user_id and plate required', { status: 400 });
    }

    const insertVehicle = await env.d1_driver_mate
        .prepare('insert into vehicles (user_id,plate,model) values (?,?,?)')
        .bind(user_id, plate, model)
        .run();

    if (insertVehicle.success) {
        return new Response('vehicles success', { status: 200 });
    }

    return new Response('Vehicle insert failed', { status: 500 });
}

// 车辆列表
export const handleVehicleList = async (request: Request, env: Env, ctx: ExecutionContext) => {
    const body = await request.json();
    if (!body || !body.user_id) {
        return new Response('user_id required', { status: 400 });
    }
    const { user_id, page = 1, pageSize = 10 } = body;
    // 查询列表数据
    const list = await env.d1_driver_mate
        .prepare('select * from vehicles where user_id = ? order by created_at desc limit ? offset ?')
        .bind(user_id, pageSize, (page - 1) * pageSize)
        .run();

    if (list.success) {
        return new Response(JSON.stringify(list.results), { status: 200 })
    }

    return new Response('查询失败', { status: 500 });
}


export default {
    handleVehicle,
    handleVehicleList,
}