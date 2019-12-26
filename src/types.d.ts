declare namespace Express {
    export interface User {
        id: string,
        displayName: string,
        avatar: string,
        email: string,
        accountType: string,
        profileId: string
    }

    export interface Request {
        webSocketId: string;
    }
}