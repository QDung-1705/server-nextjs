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
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
/*----------------------------------
-----------------------------------*/
router.get('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [notifications] = yield database_1.default.execute('SELECT * FROM notifications WHERE user_email = ? ORDER BY created_at DESC LIMIT 50', [req.params.email]);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
}));
/*----------------------------------
-----------------------------------*/
router.put('/:id/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.execute('UPDATE notifications SET `read` = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
}));
exports.default = router;
