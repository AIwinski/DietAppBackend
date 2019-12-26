import { io, userSockets } from "../app";

const broadcastMessageToConnectedUsers = (userIds: string[], event: string, data: any) => {
    let connectedUsers: string[] = [];
    userIds.forEach(userId => {
        userSockets.forEach((value, key) => {
            if (value === userId) {
                connectedUsers.push(key);
            }
        });
    });

    connectedUsers.forEach((cu: string) => {
        io.to(cu).emit(event, data);
    })
}