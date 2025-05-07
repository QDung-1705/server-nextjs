import pool from '../config/database';
import { User } from '../interfaces/User';
import bcrypt from 'bcryptjs';

export default {
    async createUser(user: User): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const [result] = await pool.execute(
            'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [user.first_name, user.last_name, user.email, hashedPassword, user.role || 'user']
        );

        const insertId = (result as any).insertId;
        return { ...user, id: insertId };
    },

    async findByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },


    async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    }
};

