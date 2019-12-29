"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const emitByUserIds = (event, data, ...userIds) => {
    let connectedUsers = [];
    userIds.forEach(userId => {
        app_1.userSockets.forEach((value, key) => {
            if (value === userId) {
                connectedUsers.push(key);
            }
        });
    });
    connectedUsers.forEach((cu) => {
        app_1.io.to(cu).emit(event, data);
    });
};
exports.emitByUserIds = emitByUserIds;
const emitToAll = (event, data) => {
    let connectedUsers = [];
    app_1.userSockets.forEach((value, key) => {
        connectedUsers.push(key);
    });
    connectedUsers.forEach((cu) => {
        app_1.io.to(cu).emit(event, data);
    });
};
exports.emitToAll = emitToAll;
//# sourceMappingURL=sockets.js.map