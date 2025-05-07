import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/*----------------------------------
-----------------------------------*/
interface DecodedToken {
    userId: number;
    role?: string;
    /*----------------------------------
    -----------------------------------*/
}

/*----------------------------------
-----------------------------------*/
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

export const adminAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Không tìm thấy token' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken;

        /*----------------------------------
        Check role admin
        -----------------------------------*/
        if (!decoded.userId) {
            res.status(403).json({ error: 'Token không hợp lệ' });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};


