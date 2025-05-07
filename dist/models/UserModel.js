"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.default = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
            const [result] = yield database_1.default.execute('INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)', [user.first_name, user.last_name, user.email, hashedPassword, user.role || 'user']);
            const insertId = result.insertId;
            return Object.assign(Object.assign({}, user), { id: insertId });
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.execute('SELECT * FROM users WHERE id = ?', [id]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        });
    }
};
