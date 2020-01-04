import { io, userSockets } from "../app";

const emitByUserIds = (event: string, data: any, ...userIds: string[]) => {
    let connectedUsers: string[] = [];
    userIds.forEach(userId => {
        userSockets.forEach((value, key) => {
            if (String(value) === String(userId)) {
                connectedUsers.push(key);
            }
        });
    });

    connectedUsers.forEach((cu: string) => {
        io.to(cu).emit(event, data);
    })
}

const emitToAll = (event: string, data: any) => {
    let connectedUsers: string[] = [];

    userSockets.forEach((value, key) => {
        connectedUsers.push(key);
    });

    connectedUsers.forEach((cu: string) => {
        io.to(cu).emit(event, data);
    })
}

export { emitByUserIds, emitToAll }