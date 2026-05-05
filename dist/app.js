"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = require("./modules/users/user.routes");
const vehicle_routes_1 = require("./modules/vehicles/vehicle.routes");
const booking_routes_1 = require("./modules/bookings/booking.routes");
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const app = (0, express_1.default)();
// initDB();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello! welcome to rental vehicel systems!");
});
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.userRoutes);
app.use("/api/v1/vehicles", vehicle_routes_1.vehicleroutes);
app.use("/api/v1/bookings", booking_routes_1.bookingRoute);
exports.default = app;
