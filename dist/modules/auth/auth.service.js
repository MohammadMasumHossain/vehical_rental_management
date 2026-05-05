"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinUser = exports.signupUser = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupUser = async (payload) => {
    // hash password
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const result = await db_1.pool.query(`INSERT INTO users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5)
     RETURNING id,name,email,phone,role`, [
        payload.name,
        payload.email.toLowerCase(),
        hashedPassword,
        payload.phone,
        payload.role,
    ]);
    return result.rows[0];
};
exports.signupUser = signupUser;
const signinUser = async (payload) => {
    const result = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [
        payload.email.toLowerCase(),
    ]);
    const user = result.rows[0];
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
};
exports.signinUser = signinUser;
