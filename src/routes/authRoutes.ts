import { Router } from 'express';
import authController from '../controllers/authController';


const router = Router();

/*----------------------------------
Register Router
-----------------------------------*/
router.post('/signup', (req, res, next) => {
    authController.signup(req, res, next).catch(next);
});

/*----------------------------------
Login Router
-----------------------------------*/
router.post('/login', (req, res, next) => {
    authController.login(req, res, next).catch(next);
});


export default router;
