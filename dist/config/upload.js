"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const randomstring_1 = __importDefault(require("randomstring"));
const image_storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, "image_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring_1.default.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
    }
});
const avatar_storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, "avatar_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring_1.default.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
    }
});
const file_storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/files");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.split(".")[0] + "__file_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring_1.default.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
    }
});
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb(new Error("Wrong file format."), false);
    }
};
const userfileFileFilter = (req, file, cb) => {
    if (true) {
        cb(null, true);
    }
    else {
        cb(new Error("Wrong file format."), false);
    }
};
const upload_image = multer_1.default({
    storage: image_storage,
    limits: {
        // up to 3 MB
        fileSize: 1028 * 1024 * 3
    },
    fileFilter: imageFileFilter
}).single("file");
exports.upload_image = upload_image;
const upload_file = multer_1.default({
    storage: file_storage,
    limits: {
        // up to 10 MB
        fileSize: 1028 * 1024 * 10
    },
    fileFilter: userfileFileFilter
}).single("file");
exports.upload_file = upload_file;
const upload_avatar = multer_1.default({
    storage: avatar_storage,
    limits: {
        // up to 10 MB
        fileSize: 1028 * 1024 * 10
    },
    fileFilter: imageFileFilter
}).single("file");
exports.upload_avatar = upload_avatar;
//# sourceMappingURL=upload.js.map