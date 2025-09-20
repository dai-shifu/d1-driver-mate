CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    -- 车牌号
    plate TEXT NOT NULL UNIQUE,
    -- 车型
    model TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses_categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 分类名称
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    -- 车辆id
    vehicle_id INTEGER NOT NULL,
    -- 分类id
    category_id INTEGER,
    -- 金额
    amount REAL NOT NULL,
    -- 发生时间
    occurred_at DATETIME NOT NULL,
    -- 备注
    remark TEXT,
    -- 票据
    receipt_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);