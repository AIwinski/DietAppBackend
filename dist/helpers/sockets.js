"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const broadcastMessageToConnectedUsers = (userIds, event, data) => {
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
//# sourceMappingURL=sockets.js.map