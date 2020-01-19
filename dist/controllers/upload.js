"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const upload_1 = require("../config/upload");
const Message_1 = require("../models/Message");
const Profile_1 = require("../models/Profile");
const Image_1 = require("../models/Image");
const User_1 = require("../models/User");
const sockets_1 = require("../helpers/sockets");
const Conversation_1 = require("../models/Conversation");
const chat_1 = require("./chat");
const uploadFile = (req, res, next) => {
    upload_1.upload_file(req, res, err => {
        // @ts-ignore
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        }
        else if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
        else {
            const userId = req.user.id;
            const text = req.body.text || "";
            const conversationId = req.body.conversationId || "0";
            const messageType = req.body.messageType || "";
            const shouldCreateNewConversation = req.body.newConversation || false;
            const newConversationUserId = req.body.newConversationUserId || "";
            if (messageType !== "file") {
                return res.status(400).json({ message: "Wrong message type." });
            }
            Conversation_1.Conversation.findAll({ include: [User_1.User] }).then(conversations => {
                if (shouldCreateNewConversation && newConversationUserId) {
                    let c = conversations.find(c => c.users.find(u => String(u.id) === String(userId)) && c.users.find(u => String(u.id) === String(newConversationUserId)));
                    if (c) {
                        return res.status(409).json({ message: "Conversation with such id already exists" });
                    }
                    else {
                        chat_1.createConversationAndAddUsers(newConversationUserId, userId).then(c => {
                            Conversation_1.Conversation.findByPk(c.id, { include: [User_1.User] }).then(c => {
                                const originalName = req.file.filename.split("__file_")[0] + "." + req.file.filename.split(".")[1];
                                chat_1.addNewMessageToConversation(c.id, "file", userId, text, req.file.path, originalName).then(m => {
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
                        const originalName = req.file.filename.split("__file_")[0] + "." + req.file.filename.split(".")[1];
                        chat_1.addNewMessageToConversation(c.id, "file", userId, text, req.file.path, originalName).then(m => {
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
    });
};
exports.uploadFile = uploadFile;
const uploadAvatar = (req, res, next) => {
    upload_1.upload_avatar(req, res, err => {
        // @ts-ignore
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        }
        else if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
        else {
            const userId = req.user.id;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            User_1.User.findByPk(userId).then(u => {
                if (!u) {
                    return res.status(404).json({ message: "User not found" });
                }
                const srcPath = req.file.path.substring(20);
                u.avatar = srcPath;
                u.save().then(u => {
                    return res.status(201).json({ user: u });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ err });
                });
            });
        }
    });
};
exports.uploadAvatar = uploadAvatar;
const uploadImage = (req, res, next) => {
    upload_1.upload_image(req, res, err => {
        // @ts-ignore
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        }
        else if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
        else {
            const userId = req.user.id;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            Profile_1.Profile.findOne({ where: { ownerId: userId } }).then(p => {
                if (!p) {
                    return res.status(404).json({ message: "Profile not found" });
                }
                const srcPath = req.file.path.substring(20);
                Image_1.Image.create({ srcPath, profileId: p.id }).then(i => {
                    return res.status(201).json({ image: i });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ err });
                });
            });
        }
    });
};
exports.uploadImage = uploadImage;
const downloadFile = (req, res, next) => {
    const messageId = req.params.messageId;
    const userId = req.user.id;
    Message_1.Message.findOne({ where: { id: messageId }, include: [{ model: Conversation_1.Conversation, include: [User_1.User] }] }).then(m => {
        if (!m) {
            return res.status(404).json({ message: "File not found" });
        }
        if (!m.conversation.users.find(u => String(u.id) == userId)) {
            return res.status(401).json({ message: "User is not allowed to access this file message" });
        }
        const path = m.srcPath;
        console.log(path);
        return res.download(path);
    });
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=upload.js.map