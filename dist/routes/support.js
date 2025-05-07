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
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const adminAuth_1 = require("../middleware/adminAuth");
const router = (0, express_1.Router)();
/*----------------------------------
Get all request support
-----------------------------------*/
const getAllRequests = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [requests] = yield database_1.default.execute('SELECT * FROM support_requests ORDER BY created_at DESC');
        res.json(requests);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách hỗ trợ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
/*----------------------------------
Support response function requested 1
-----------------------------------*/
const replyToRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        /*----------------------------------
        Connetdb getall support
        -----------------------------------*/
        const [requests] = yield database_1.default.execute('SELECT email, topic FROM support_requests WHERE id = ?', [id]);
        if (requests.length === 0) {
            res.status(404).json({ error: 'Không tìm thấy yêu cầu hỗ trợ' });
            return;
        }
        const request = requests[0];
        /*----------------------------------
         -----------------------------------*/
        yield database_1.default.execute('UPDATE support_requests SET reply = ?, status = "replied", replied_at = NOW() WHERE id = ?', [reply, id]);
        /*----------------------------------
       -----------------------------------*/
        console.log('Creating notification for:', {
            email: request.email,
            topic: request.topic,
            reply: reply
        });
        yield database_1.default.execute('INSERT INTO notifications (user_email, title, message, is_read) VALUES (?, ?, ?, FALSE)', [
            request.email,
            `Phản hồi cho yêu cầu: ${request.topic}`,
            reply
        ]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Lỗi khi phản hồi:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
/*----------------------------------
Create request support handler
-----------------------------------*/
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, topic, message } = req.body;
        if (!name || !email || !topic || !message) {
            res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
            return;
        }
        yield database_1.default.execute('INSERT INTO support_requests (name, email, topic, message) VALUES (?, ?, ?, ?)', [name, email, topic, message]);
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error('Lỗi khi tạo yêu cầu hỗ trợ:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
/*----------------------------------
-----------------------------------*/
router.get('/', adminAuth_1.adminAuth, getAllRequests);
router.post('/:id/reply', adminAuth_1.adminAuth, replyToRequest);
router.post('/', createRequest);
exports.default = router;
