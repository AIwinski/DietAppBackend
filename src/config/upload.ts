import multer from 'multer'
import randomstring from 'randomstring'

const image_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/images");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            "image_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.split(".")[1]
        );
    }
});

const avatar_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/images");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            "avatar_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.split(".")[1]
        );
    }
});

const file_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./dist/uploads/files");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.originalname.split(".")[0] + "__file_" +
            new Date().toISOString().replace(/:|\./g, "_") + "_" +
            randomstring.generate({ length: 12, charset: "alphabetic" }) +
            "." +
            file.originalname.split(".")[1]
        );
    }
});

const imageFileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Wrong file format."), false);
    }
};

const userfileFileFilter = (req: any, file: any, cb: any) => {
    if (
        true
    ) {
        cb(null, true);
    } else {
        cb(new Error("Wrong file format."), false);
    }
};

const upload_image = multer({
    storage: image_storage,
    limits: {
        // up to 3 MB
        fileSize: 1028 * 1024 * 3
    },
    fileFilter: imageFileFilter
}).single("file");


const upload_file = multer({
    storage: file_storage,
    limits: {
        // up to 10 MB
        fileSize: 1028 * 1024 * 10
    },
    fileFilter: userfileFileFilter
}).single("file");

const upload_avatar = multer({
    storage: avatar_storage,
    limits: {
        // up to 10 MB
        fileSize: 1028 * 1024 * 10
    },
    fileFilter: imageFileFilter
}).single("file");

export { upload_file, upload_image, upload_avatar }
