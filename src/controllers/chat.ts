import { Request, Response, NextFunction } from "express";
import { Conversation } from "../models/Conversation";
import { User } from "../models/User";
import { Message } from "../models/Message";


const getConversations = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        User.findOne({ where: { id: userId }, include: [{ model: Conversation, include: [User] }] }).then(u => {
            return res.status(200).json({ conversations: u.conversations, u: u });
        }).catch(e => {
            return res.status(500).json({ err: e });
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
}

const getMessages = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        let qty: number;
        let offset: number;
        try {
            qty = parseInt(req.query.qty);
            offset = parseInt(req.query.offset);
        } catch (err) {
            return res.status(400).json({ err: err })
        }

        const conversationId = req.params.id;

        Conversation.findOne({ include: [{ model: User, through: { where: { userId: userId, conversationId: conversationId } } }] }).then(c => {
            if (!c) {
                return res.status(404).json({ message: "Conversation with such id does not exist or user does not have access to it" });
            }
            c.$get('messages', { order: [['created_at', 'ASC']], offset: offset, limit: qty }).then(messages => {
                return res.status(200).json({ messages });
            })
        }).catch(e => {
            console.log(e)
            return res.status(500).json({ err: e });
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
}

const getInfo = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (e) {
        return res.status(500).json({ err: e });
    }
}

const sendTextMessage = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const text = req.body.text || "";
        const conversationId = req.body.conversationId || "0";
        const messageType = req.body.messageType || "";
        const shouldCreateNewConversation = req.body.newConversation || false;

        if (messageType !== "text") {
            return res.status(400).json({ message: "Wrong message type." })
        }

        Conversation.findOne({ include: [{ model: User, through: { where: { userId: userId, conversationId: conversationId } } }] }).then(c => {
            if (shouldCreateNewConversation) {
                if (c) {
                    return res.status(409).json({ message: "Conversation with such id already exists" });
                } else {
                    const newUserId = req.body.newConversationUserId;
                    createConversationAndAddUsers(newUserId, userId).then(c => {
                        addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                            return res.status(201).json({ createdNewConversation: true, newConversation: c, message: m });
                        }).catch(err => {
                            return res.status(500).json({ err });
                        })
                    });
                }
            } else {
                if (c) {
                    addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                        return res.status(201).json({ createdNewConversation: false, message: m });
                    }).catch(err => {
                        return res.status(500).json({ err });
                    });
                } else {
                    return res.status(404).json({ message: "Not found conversation with such id" });
                }
            }
        }).catch(e => {
            console.log(e)
            return res.status(500).json({ err: e });
        })
    } catch (e) {
        return res.status(500).json({ err: e });
    }
}

const addNewMessageToConversation = async (conversationId: string, messageType: string, senderId: string, text: string, srcPath: string): Promise<Message> => {
    return Message.create({ messageType, text, senderId, conversationId, srcPath });
}

const createConversationAndAddUsers = async (...userIds: string[]): Promise<Conversation> => {
    return new Promise((resolve, reject) => {
        Conversation.create().then(async c => {
            try {
                await userIds.forEach(async uid => {
                    console.log("USERID: " + uid)
                    await c.$add('users', uid)
                });
                resolve(c);
            } catch (e) {
                reject(e);
            }
        }).catch(e => {
            reject(e);
        })
    })
}

export { getMessages, getConversations, getInfo, sendTextMessage }