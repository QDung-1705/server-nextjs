import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import { User } from '../interfaces/User';


export default {
    /*-----------------------------------------
   Create Api Sigup
   -------------------------------------------*/
    async signup(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name: first_name, lname: last_name, email, password, cpassword } = req.body;

            if (password !== cpassword) {
                res.status(400).json({ error: 'Mật khẩu không khớp' });
                return;
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ error: 'Email đã được sử dụng' });
                return;
            }

            const newUser: User = {
                first_name,
                last_name,
                email,
                password
            };

            const createdUser = await UserModel.createUser(newUser);
            const { password: _, ...userWithoutPassword } = createdUser;

            res.status(201).json({
                message: 'Đăng ký thành công',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error(error);
            next(error);
        }

    },
    /*-----------------------------------------
    Create Api Login
    -------------------------------------------*/
    async login(req: Request, res: Response, next: unknown) {
        try {
            const { email, password } = req.body;


            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Email không tồn tại' });
            }


            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Mật khẩu không đúng' });
            }


            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );


            const { password: _, ...userWithoutPassword } = user;
            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

};