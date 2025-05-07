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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const database_1 = __importDefault(require("../config/database"));
/*----------------------------------
Get all product
-----------------------------------*/
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query('SELECT * FROM products');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm' });
    }
});
exports.getAllProducts = getAllProducts;
/*----------------------------------
Get all product by id
-----------------------------------*/
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield database_1.default.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        }
        else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm' });
    }
});
exports.getProductById = getProductById;
/*----------------------------------
Create Product
-----------------------------------*/
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, originalPrice, price, discount, tag, image } = req.body;
    try {
        const [result] = yield database_1.default.query('INSERT INTO products (title, originalPrice, price, discount, tag, image) VALUES (?, ?, ?, ?, ?, ?)', [title, originalPrice, price, discount, tag, image]);
        res.status(201).json({
            id: result.insertId,
            title,
            originalPrice,
            price,
            discount,
            tag,
            image
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    }
});
exports.createProduct = createProduct;
/*----------------------------------
Update prodcut
-----------------------------------*/
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, originalPrice, price, discount, tag, image } = req.body;
    try {
        const [result] = yield database_1.default.query('UPDATE products SET title = ?, originalPrice = ?, price = ?, discount = ?, tag = ?, image = ? WHERE id = ?', [title, originalPrice, price, discount, tag, image, id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cập nhật sản phẩm thành công' });
        }
        else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
});
exports.updateProduct = updateProduct;
/*----------------------------------
Delete product
-----------------------------------*/
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield database_1.default.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Xoá sản phẩm thành công' });
        }
        else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Lỗi khi xoá sản phẩm' });
    }
});
exports.deleteProduct = deleteProduct;
