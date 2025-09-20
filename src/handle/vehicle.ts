export const handleVehicle = async (request: Request, env: Env, ctx: ExecutionContext) => {
    return new Response('Vehicle', { status: 200 });
}

export const handleVehicleList = async (request: Request, env: Env, ctx: ExecutionContext) => {
    return new Response('VehicleList', { status: 200 });
}


export default {
    handleVehicle,
    handleVehicleList,
}