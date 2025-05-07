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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
exports.default = {
    /*-----------------------------------------
   Create Api Sigup
   -------------------------------------------*/
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name: first_name, lname: last_name, email, password, cpassword } = req.body;
                if (password !== cpassword) {
                    res.status(400).json({ error: 'Mật khẩu không khớp' });
                    return;
                }
                const existingUser = yield UserModel_1.default.findByEmail(email);
                if (existingUser) {
                    res.status(400).json({ error: 'Email đã được sử dụng' });
                    return;
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    password
                };
                const createdUser = yield UserModel_1.default.createUser(newUser);
                const { password: _ } = createdUser, userWithoutPassword = __rest(createdUser, ["password"]);
                res.status(201).json({
                    message: 'Đăng ký thành công',
                    user: userWithoutPassword
                });
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        });
    },
    /*-----------------------------------------
    Create Api Login
    -------------------------------------------*/
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield UserModel_1.default.findByEmail(email);
                if (!user) {
                    return res.status(401).json({ error: 'Email không tồn tại' });
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Mật khẩu không đúng' });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.json({
                    message: 'Đăng nhập thành công',
                    token,
                    user: userWithoutPassword
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Lỗi server' });
            }
        });
    }
};
