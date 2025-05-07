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
exports.updateOrderStatus = exports.getAllOrders = exports.createOrder = void 0;
const database_1 = __importDefault(require("../config/database"));
/*-----------------------------------------
 Create order
  -------------------------------------------*/
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, phone, address, productId, productTitle, productPrice } = req.body;
        /*-----------------------------------------
                Check db
        -------------------------------------------*/
        if (!fullName || !email || !phone || !address || !productId || !productTitle || !productPrice) {
            res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
            return;
        }
        /*-----------------------------------------
              Add db
       -------------------------------------------*/
        yield database_1.default.execute("INSERT INTO orders (full_name, email, phone, address, product_id, product_title, product_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')", [fullName, email, phone, address, productId, productTitle, productPrice]);
        res.status(200).json({ message: "Đặt hàng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.createOrder = createOrder;
/*-----------------------------------------
    Get all product
  -------------------------------------------*/
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [orders] = yield database_1.default.execute('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(orders);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
exports.getAllOrders = getAllOrders;
/*-----------------------------------------
  Update status product
  -------------------------------------------*/
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log('Yeu cau nhan:', {
            id,
            status,
            headers: req.headers,
            body: req.body
        });
        /*----------------------------------
        Check for valid status
        -----------------------------------*/
        const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Trạng thái không hợp lệ' });
            return;
        }
        /*----------------------------------
        
            Find order by id
        -----------------------------------*/
        const [orders] = yield database_1.default.execute('SELECT id, email, product_title FROM orders WHERE id = ?', [id]);
        if (!orders || orders.length === 0) {
            res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
            return;
        }
        const order = orders[0];
        /*----------------------------------
        Check for email
        -----------------------------------*/
        if (!order.email) {
            console.error('Email not found for order:', order);
            res.status(400).json({ error: 'Thiếu thông tin email trong đơn hàng' });
            return;
        }
        /*----------------------------------
        Update status
        -----------------------------------*/
        yield database_1.default.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        /*----------------------------------
        Create notifications
        -----------------------------------*/
        yield database_1.default.execute('INSERT INTO notifications (user_email, title, message, is_read) VALUES (?, ?, ?, FALSE)', [
            order.email,
            `Cập nhật đơn hàng: ${order.product_title}`,
            `Đơn hàng của bạn đã được cập nhật sang trạng thái: ${status}`
        ]);
        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            order: Object.assign(Object.assign({}, order), { status })
        });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({
            error: 'Lỗi server',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
