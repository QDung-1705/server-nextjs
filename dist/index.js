"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const chatbot_1 = __importDefault(require("./routes/chatbot"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const support_1 = __importDefault(require("./routes/support"));
const notifications_1 = __importDefault(require("./routes/notifications"));
/*------------------------------------
Dotnev
--------------------------------------*/
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
/*------------------------------------
Middleware
--------------------------------------*/
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/*------------------------------------
Routes
--------------------------------------*/
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/chatbot', chatbot_1.default);
app.use('/api/orders', order_routes_1.default);
app.use("/api/support", support_1.default);
app.use('/api/notifications', notifications_1.default);
/*------------------------------------
Start Servers
--------------------------------------*/
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
/*------------------------------------
Check connect Database
--------------------------------------*/
database_1.default.getConnection()
    .then((connection) => {
    console.log('Database connected successfully!');
    connection.release();
})
    .catch((err) => {
    console.error('Database connection failed:', err);
});
