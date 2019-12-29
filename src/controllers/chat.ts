import { Request, Response, NextFunction } from "express";
import { Conversation } from "../models/Conversation";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { emitByUserIds, emitToAll } from "../helpers/sockets";


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

        Conversation.findOne({ where: { id: conversationId }, include: [User] }).then(c => {
            if (!c) {
                return res.status(404).json({ message: "Conversation with such id does not exist" });
            }
            if (!c.users.find(u => String(u.id) === String(userId))) {
                return res.status(401).json({ message: "This user is not allowed to access this conversation" })
            }
            Message.findAll({ where: { conversationId: c.id }, order: [['created_at', 'ASC']], offset: offset, limit: qty }).then(messages => {
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
        const newConversationUserId = req.body.newConversationUserId || "";
        console.log(req.body)

        if (messageType !== "text") {
            return res.status(400).json({ message: "Wrong message type." })
        }

        Conversation.findAll({ include: [User] }).then(conversations => {
            if (shouldCreateNewConversation && newConversationUserId) {
                let c = conversations.find(c => c.users.find(u => String(u.id) === String(userId)) && c.users.find(u => String(u.id) === String(newConversationUserId)));
                if (c) {
                    return res.status(409).json({ message: "Conversation with such id already exists" });
                } else {
                    createConversationAndAddUsers(newConversationUserId, userId).then(c => {
                        Conversation.findByPk(c.id, { include: [User] }).then(c => {
                            addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                                c.users.forEach(u => {
                                    emitByUserIds("MESSAGE", {
                                        createdNewConversation: true, newConversation: c, message: m
                                    }, u.id)
                                });
                                return res.status(201).json({ createdNewConversation: true, newConversation: c, message: m });
                            }).catch(err => {
                                console.log(err)
                                return res.status(500).json({ err });
                            });
                        });
                    });
                }
            } else {
                let c = conversations.find(c => String(c.id) === String(conversationId));
                if (c) {
                    addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                        c.users.forEach(u => {
                            emitByUserIds("MESSAGE", {
                                message: m
                            }, u.id)
                        });
                        return res.status(201).json({ createdNewConversation: false, message: m });
                    }).catch(err => {
                        console.log(err)
                        return res.status(500).json({ err });
                    });
                } else {
                    return res.status(404).json({ message: "Conversation does not exist" })
                }
            }
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
}

const addNewMessageToConversation = async (conversationId: string, messageType: string, senderId: string, text: string, srcPath: string): Promise<Message> => {
    return Message.create({ messageType, text, senderId, conversationId, srcPath });
}

const createConversationAndAddUsers = (...userIds: string[]): Promise<Conversation> => {
    return new Promise((resolve, reject) => {
        Conversation.create().then(async c => {
            try {
                for (const uid of userIds) {
                    await c.$add('users', uid)
                }
                c.save().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                });
            } catch (e) {
                reject(e);
            }
        }).catch(e => {
            reject(e);
        })
    })
}

export { getMessages, getConversations, getInfo, sendTextMessage }