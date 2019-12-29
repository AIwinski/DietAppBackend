import { Request, Response, NextFunction } from "express";
import multer from 'multer'
import { upload_file, upload_image, upload_avatar } from "../config/upload";
import { Message } from "../models/Message";
import { Profile } from "../models/Profile";
import { Image } from "../models/Image";
import { User } from "../models/User";
import { emitByUserIds } from "../helpers/sockets";
import { Conversation } from "../models/Conversation";
import { createConversationAndAddUsers, addNewMessageToConversation } from "./chat";

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    upload_file(req, res, err => {
        // @ts-ignore
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        } else if (err) {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        } else {
            const userId = req.user.id;
            const text = req.body.text || "";
            const conversationId = req.body.conversationId || "0";
            const messageType = req.body.messageType || "";
            const shouldCreateNewConversation = req.body.newConversation || false;
            const newConversationUserId = req.body.newConversationUserId || "";
            if (messageType !== "file") {
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
                                const originalName = req.file.filename.split("__file_")[0] + "." + req.file.filename.split(".")[1];
                                addNewMessageToConversation(c.id, "file", userId, text, req.file.path, originalName).then(m => {
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
                        const originalName = req.file.filename.split("__file_")[0] + "." + req.file.filename.split(".")[1];
                        addNewMessageToConversation(c.id, "file", userId, text, req.file.path, originalName).then(m => {
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
        }
    });
}

const uploadAvatar = (req: Request, res: Response, next: NextFunction) => {
    upload_avatar(req, res, err => {
        // @ts-ignore
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        } else if (err) {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        } else {
            const userId = req.user.id;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            User.findByPk(userId).then(u => {
                if (!u) {
                    return res.status(404).json({ message: "User not found" });
                }
                const srcPath = req.file.path.substring(20);
                u.avatar = srcPath;
                u.save().then(u => {
                    return res.status(201).json({ user: u })
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json({ err })
                });
            });
        }
    });
}

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    upload_image(req, res, err => {
        // @ts-ignore
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: err,
                message: "Upload error"
            });
        } else if (err) {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        } else {
            const userId = req.user.id;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            Profile.findOne({ where: { ownerId: userId } }).then(p => {
                if (!p) {
                    return res.status(404).json({ message: "Profile not found" });
                }
                const srcPath = req.file.path.substring(20);
                Image.create({ srcPath, profileId: p.id }).then(i => {
                    return res.status(201).json({ image: i })
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json({ err })
                })
            });
        }
    });
}

const downloadFile = (req: Request, res: Response, next: NextFunction) => {
    const messageId = req.params.messageId;
    const userId = req.user.id;
    Message.findOne({ where: { id: messageId }, include: [{ model: Conversation, include: [User] }] }).then(m => {
        if (!m) {
            return res.status(404).json({ message: "File not found" });
        }
        if (!m.conversation.users.find(u => String(u.id) == userId)) {
            return res.status(401).json({ message: "User is not allowed to access this file message" })
        }
        return res.download(m.srcPath);
    })
}

export { uploadAvatar, uploadFile, uploadImage, downloadFile };
