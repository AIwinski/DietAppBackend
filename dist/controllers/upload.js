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
            const text = req.body.text;
            const conversationId = req.body.conversationId;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            Message_1.Message.create({ conversationId, messageType: 'file', text, senderId: userId, srcPath: req.file.path }).then(m => {
                return res.status(200).json({ message: m });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ err: err });
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
    Message_1.Message.findOne({ where: { id: messageId } }).then(m => {
        if (!m) {
            return res.status(404).json({ message: "File not found" });
        }
        return res.download(m.srcPath);
    });
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=upload.js.map