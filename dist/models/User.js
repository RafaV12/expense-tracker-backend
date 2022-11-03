"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
        minlength: 8,
    },
    transactions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tx',
        },
    ],
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
