import express from "express";
import bodyParser from "body-parser";
import path from 'path'
import morgan from "morgan"
import cors from "cors"
import http from "http"
import socketio from 'socket.io'
import redis from "redis"
import compression from "compression"
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./config/sequelize";

import * as authRoutes from "./routes/auth";
import * as chatRoutes from "./routes/chat";
import * as profileRoutes from "./routes/profile";
import * as uploadRoutes from "./routes/upload";
import * as patientRoutes from "./routes/patient";
import * as userRoutes from "./routes/user";
import { emitByUserIds } from "./helpers/sockets";

sequelize
    .authenticate()
    .then(() => {
        console.log("DB connection has been established successfully.");
    })
    .catch((err: any) => {
        console.error("Unable to connect to the database:" + err);
    });

// WARNING SYNC DB CODE ============================

// sequelize.sync({ force: true }).then(() => {
//     console.log("Database synced");
// });

//=================================================

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

let userSockets: Map<string, string> = new Map(); //socektid , userid

io.on("connection", socket => {
    socket.emit('SET_ID', socket.id);

    socket.on("disconnect", () => {
        //console.log("user disconnected id: " + socket.id);
        userSockets.delete(socket.id)
        //console.log(Array.from(userSockets))
    });

    socket.on("WEBRTC_SEND", (data) => {
        console.log("WEBRTC SEND")
        console.log(data.id)
        console.log(userSockets)
        emitByUserIds("WEBRTC", data, data.id);
    })

    socket.on("WEBRTC_JOIN", (data) => {
        console.log("WEBRTC JOIN")
        emitByUserIds("WEBRTC_JOINED", data, data.id);
        // for (let item of userSockets.values()) {
        //     if (item === data.id) {
        //         emitByUserIds("WEBRTC", data, item);
        //         socket.emit("WEBRTC_JOINED", data)
        //         break;
        //     }
        // }
    })

    socket.on("WEBRTC_LEAVE", (data) => {
        console.log("WEBRTC LEAVE")
        emitByUserIds("WEBRTC_LEFT", data, data.id);
    })

    socket.on("WEBRTC_CHANGE_STATUS", (data) => {
        console.log("WEBRTC_CHANGE_STATUS")
        emitByUserIds("WEBRTC_STATUS_CHANGED", data, data.id);
    })
});

app.use((req: Request, res: Response, next: NextFunction) => {
    let webSocketId: string;
    let token;
    let payload;
    let userId;
    //@ts-ignore
    webSocketId = req.headers['socketid'] || '';
    req.webSocketId = webSocketId;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
            if (payload) {
                //@ts-ignore
                userId = payload.sub;
            }
        } catch (TokenExpiredError) {
            payload = null;
        }
    }
    if (webSocketId && userId) {
        userSockets.set(String(webSocketId), String(userId));
    }
    console.log(Array.from(userSockets))
    next();
});

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression())
app.use("/uploads", express.static(path.join(__dirname, "uploads/images")));



app.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200)
});

app.use("/auth", authRoutes.router);
app.use("/chat", chatRoutes.router);
app.use("/profile", profileRoutes.router);
app.use("/upload", uploadRoutes.router);
app.use("/patient", patientRoutes.router);
app.use("/user", userRoutes.router);

app.get("*", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Route not found" })
});

const PORT = process.env.PORT || 4000;
const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 6379;

app.set("port", PORT);

// const redisClient = redis.createClient(REDIS_PORT);

// redisClient.on("error", console.error);
// redisClient.on("connect", () => {
//     console.log("Connected to redis successfully");
// });

export { server, app, io, userSockets };