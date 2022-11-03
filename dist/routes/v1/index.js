"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: auth_1.default,
    },
    {
        path: '/user',
        route: user_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
