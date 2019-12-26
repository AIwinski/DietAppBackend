import { Request, Response, NextFunction } from "express";
import multer from 'multer'
import { upload_file, upload_image, upload_avatar } from "../config/upload";
import { Message } from "../models/Message";
import { Profile } from "../models/Profile";
import { Image } from "../models/Image";
import { User } from "../models/User";

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
            const text = req.body.text;
            const conversationId = req.body.conversationId;
            if (!req.file) {
                return res.status(500).json({ message: "File not uploaded error" });
            }
            Message.create({ conversationId, messageType: 'file', text, senderId: userId, srcPath: req.file.path }).then(m => {
                return res.status(200).json({ message: m });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ err: err });
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
    Message.findOne({ where: { id: messageId } }).then(m => {
        if (!m) {
            return res.status(404).json({ message: "File not found" });
        }
        return res.download(m.srcPath);
    })
}

export { uploadAvatar, uploadFile, uploadImage, downloadFile };
