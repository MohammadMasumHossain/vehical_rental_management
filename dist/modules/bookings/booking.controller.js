"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.getBookings = exports.createBooking = void 0;
const service = __importStar(require("./booking.service"));
const createBooking = async (req, res) => {
    try {
        const data = await service.createBooking(req.body, req.user);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createBooking = createBooking;
const getBookings = async (req, res) => {
    try {
        const data = await service.getBookings(req.user);
        res.json({
            success: true,
            message: req.user.role === "admin"
                ? "Bookings retrieved successfully"
                : "Your bookings retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getBookings = getBookings;
const updateBooking = async (req, res) => {
    try {
        const data = await service.updateBooking(Number(req.params.bookingId), req.body.status, req.user);
        res.json({
            success: true,
            message: req.body.status === "cancelled"
                ? "Booking cancelled successfully"
                : "Booking marked as returned. Vehicle is now available",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateBooking = updateBooking;
