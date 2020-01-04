"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const compression_1 = __importDefault(require("compression"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize_1 = require("./config/sequelize");
const authRoutes = __importStar(require("./routes/auth"));
const chatRoutes = __importStar(require("./routes/chat"));
const profileRoutes = __importStar(require("./routes/profile"));
const uploadRoutes = __importStar(require("./routes/upload"));
const sockets_1 = require("./helpers/sockets");
sequelize_1.sequelize
    .authenticate()
    .then(() => {
    console.log("DB connection has been established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:" + err);
});
// WARNING SYNC DB CODE ============================
// sequelize.sync({ force: true }).then(() => {
//     console.log("Database synced");
// });
//=================================================
const app = express_1.default();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = socket_io_1.default.listen(server);
exports.io = io;
let userSockets = new Map(); //socektid , userid
exports.userSockets = userSockets;
io.on("connection", socket => {
    console.log("user connected to socket id: " + socket.id);
    socket.emit('SET_ID', socket.id);
    socket.on("disconnect", () => {
        //console.log("user disconnected id: " + socket.id);
        userSockets.delete(socket.id);
        //console.log(Array.from(userSockets))
    });
    socket.on("test", () => {
        console.log("test working");
    });
    socket.on("WEBRTC_SEND", (data) => {
        console.log("WEBRTC SEND");
        console.log(data.id);
        console.log(userSockets);
        sockets_1.emitByUserIds("WEBRTC", data, data.id);
    });
    socket.on("WEBRTC_JOIN", (data) => {
        console.log("WEBRTC JOIN");
        sockets_1.emitByUserIds("WEBRTC_JOINED", data, data.id);
    });
    socket.on("WEBRTC_LEAVE", (data) => {
        console.log("WEBRTC LEAVE");
        sockets_1.emitByUserIds("WEBRTC_LEFT", data, data.id);
    });
    socket.on("WEBRTC_CHANGE_STATUS", (data) => {
        console.log("WEBRTC_CHANGE_STATUS");
        sockets_1.emitByUserIds("WEBRTC_STATUS_CHANGED", data, data.id);
    });
});
app.use((req, res, next) => {
    let webSocketId;
    let token;
    let payload;
    let userId;
    //@ts-ignore
    webSocketId = req.headers['socketid'] || '';
    req.webSocketId = webSocketId;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        try {
            payload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            if (payload) {
                //@ts-ignore
                userId = payload.sub;
            }
        }
        catch (TokenExpiredError) {
            payload = null;
        }
    }
    if (webSocketId) {
        userSockets.set(webSocketId, userId);
    }
    console.log(Array.from(userSockets));
    next();
});
app.use(morgan_1.default("tiny"));
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(compression_1.default());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads/images")));
app.use("/auth", authRoutes.router);
app.use("/chat", chatRoutes.router);
app.use("/profile", profileRoutes.router);
app.use("/upload", uploadRoutes.router);
app.get("*", (req, res) => {
    return res.status(404).json({ message: "Route not found" });
});
const PORT = process.env.PORT || 4000;
const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 6379;
app.set("port", PORT);
//# sourceMappingURL=app.js.map