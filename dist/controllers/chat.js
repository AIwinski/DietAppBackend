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
        Conversation_1.Conversation.findOne({ include: [{ model: User_1.User, through: { where: { userId: userId, conversationId: conversationId } } }] }).then(c => {
            if (!c) {
                return res.status(404).json({ message: "Conversation with such id does not exist or user does not have access to it" });
            }
            c.$get('messages', { order: [['created_at', 'ASC']], offset: offset, limit: qty }).then(messages => {
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
        if (messageType !== "text") {
            return res.status(400).json({ message: "Wrong message type." });
        }
        Conversation_1.Conversation.findOne({ include: [{ model: User_1.User, through: { where: { userId: userId, conversationId: conversationId } } }] }).then(c => {
            if (shouldCreateNewConversation) {
                if (c) {
                    return res.status(409).json({ message: "Conversation with such id already exists" });
                }
                else {
                    const newUserId = req.body.newConversationUserId;
                    createConversationAndAddUsers(newUserId, userId).then(c => {
                        addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                            return res.status(201).json({ createdNewConversation: true, newConversation: c, message: m });
                        }).catch(err => {
                            return res.status(500).json({ err });
                        });
                    });
                }
            }
            else {
                if (c) {
                    addNewMessageToConversation(c.id, "text", userId, text, "").then(m => {
                        return res.status(201).json({ createdNewConversation: false, message: m });
                    }).catch(err => {
                        return res.status(500).json({ err });
                    });
                }
                else {
                    return res.status(404).json({ message: "Not found conversation with such id" });
                }
            }
        }).catch(e => {
            console.log(e);
            return res.status(500).json({ err: e });
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.sendTextMessage = sendTextMessage;
const addNewMessageToConversation = (conversationId, messageType, senderId, text, srcPath) => __awaiter(void 0, void 0, void 0, function* () {
    return Message_1.Message.create({ messageType, text, senderId, conversationId, srcPath });
});
const createConversationAndAddUsers = (...userIds) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        Conversation_1.Conversation.create().then((c) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield userIds.forEach((uid) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("USERID: " + uid);
                    yield c.$add('users', uid);
                }));
                resolve(c);
            }
            catch (e) {
                reject(e);
            }
        })).catch(e => {
            reject(e);
        });
    });
});
//# sourceMappingURL=chat.js.map