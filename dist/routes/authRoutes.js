"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
/*----------------------------------
Register Router
-----------------------------------*/
router.post('/signup', (req, res, next) => {
    authController_1.default.signup(req, res, next).catch(next);
});
/*----------------------------------
Login Router
-----------------------------------*/
router.post('/login', (req, res, next) => {
    authController_1.default.login(req, res, next).catch(next);
});
exports.default = router;
