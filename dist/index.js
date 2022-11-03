"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
const v1_1 = __importDefault(require("./routes/v1"));
const not_found_1 = require("./middlewares/not-found");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Connect to MongoDB
(0, connect_1.default)();
// Enable cors
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
// Parse json request body
app.use(express_1.default.json());
// Parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// Sanitize request data
app.use((0, express_mongo_sanitize_1.default)());
// v1 api routes
app.use('/v1', v1_1.default);
// Error middlewares
app.use(not_found_1.notFound);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
