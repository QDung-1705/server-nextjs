"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    /*------------------------------------------
    *Connect db used MysqlWordbend
    -------------------------------------------*/
    host: 'localhost',
    user: 'root',
    password: 'dung1705',
    database: 'clothes_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.default = pool;
