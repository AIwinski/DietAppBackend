"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conversation_1 = require("../models/Conversation");
const User_1 = require("../models/User");
const Message_1 = require("../models/Message");
const sockets_1 = require("../helpers/sockets");
const getConversations = (req, res, next) => {
    try {
        const userId = req.user.id;
        User_1.User.findOne({ where: { id: userId }, include: [{ model: Conversation_1.Conversation, include: [User_1.User] }] }).then(u => {
            return res.status(200).json({ conversations: u.conversations, u: u });
        }).catch(e => {
            return res.status(500).json({ err: e });
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.getConversations = getConversations;
const getMessages = (req, res, next) => {
    try {
        const userId = req.user.id;
        let qty;
        let offset;
        try {
            qty = parseInt(req.query.qty);
            offset = parseInt(req.query.offset);
        }
        catch (err) {
            return res.status(400).json({ err: err });
        }
        const conversationId = req.params.id;
        Conversation_1.Conversation.findOne({ where: { id: conversationId }, include: [User_1.User] }).then(c => {
            if (!c) {
                return res.status(404).json({ message: "Conversation with such id does not exist" });
            }
            if (!c.users.find(u => String(u.id) === String(userId))) {
                return res.status(401).json({ message: "This user is not allowed to access this conversation" });
            }
            Message_1.Message.findAll({ where: { conversationId: c.id }, order: [['created_at', 'ASC']], offset: offset, limit: qty }).then(messages => {
                return res.status(200).json({ messages });
            });
        }).catch(e => {
            console.log(e);
            return res.status(500).json({ err: e });
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.getMessages = getMessages;
const getInfo = (req, res, next) => {
    try {
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.getInfo = getInfo;
const sendTextMessage = (req, res, next) => {
    try {
        const userId = req.user.id;
        const text = req.body.text || "";
        const conversationId = req.body.conversationId || "0";
        const messageType = req.body.messageType || "";
        const shouldCreateNewConversation = req.body.newConversation || false;
        const newConversationUserId = req.body.newConversationUserId || "";
        if (messageType !== "text") {
            return res.status(400).json({ message: "Wrong message type." });
        }
        Conversation_1.Conversation.findAll({ include: [User_1.User] }).then(conversations => {
            if (shouldCreateNewConversation && newConversationUserId) {
                let c = conversations.find(c => c.users.find(u => String(u.id) === String(userId)) && c.users.find(u => String(u.id) === String(newConversationUserId) && String(u.id) !== String(newConversationUserId)));
                if (c) {
                    return res.status(409).json({ message: "Conversation with such id already exists" });
                }
                else {
                    createConversationAndAddUsers(newConversationUserId, userId).then(c => {
                        Conversation_1.Conversation.findByPk(c.id, { include: [User_1.User] }).then(c => {
                            addNewMessageToConversation(c.id, "text", userId, text, "", "").then(m => {
                                c.users.forEach(u => {
                                    sockets_1.emitByUserIds("MESSAGE", {
                                        createdNewConversation: true, newConversation: c, message: m
                                    }, u.id);
                                });
                                return res.status(201).json({ createdNewConversation: true, newConversation: c, message: m });
                            }).catch(err => {
                                console.log(err);
                                return res.status(500).json({ err });
                            });
                        });
                    });
                }
            }
            else {
                let c = conversations.find(c => String(c.id) === String(conversationId));
                if (c) {
                    addNewMessageToConversation(c.id, "text", userId, text, "", "").then(m => {
                        c.users.forEach(u => {
                            sockets_1.emitByUserIds("MESSAGE", {
                                message: m
                            }, u.id);
                        });
                        return res.status(201).json({ createdNewConversation: false, message: m });
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json({ err });
                    });
                }
                else {
                    return res.status(404).json({ message: "Conversation does not exist" });
                }
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: err });
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.sendTextMessage = sendTextMessage;
const addNewMessageToConversation = (conversationId, messageType, senderId, text, srcPath, initialFileName) => __awaiter(void 0, void 0, void 0, function* () {
    return Message_1.Message.create({ messageType, text, senderId, conversationId, srcPath, initialFileName });
});
exports.addNewMessageToConversation = addNewMessageToConversation;
const createConversationAndAddUsers = (...userIds) => {
    return new Promise((resolve, reject) => {
        Conversation_1.Conversation.create().then((c) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                for (const uid of userIds) {
                    yield c.$add('users', uid);
                }
                c.save().then(result => {
                    Conversation_1.Conversation.findByPk(result.id, { include: [User_1.User] }).then(c => {
                        resolve(c);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        })).catch(e => {
            reject(e);
        });
    });
};
exports.createConversationAndAddUsers = createConversationAndAddUsers;
//# sourceMappingURL=chat.js.map