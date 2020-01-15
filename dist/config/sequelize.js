"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("../models/User");
const Profile_1 = require("../models/Profile");
const Message_1 = require("../models/Message");
const Conversation_1 = require("../models/Conversation");
const PriceListElement_1 = require("../models/PriceListElement");
const UserConversation_1 = require("../models/UserConversation");
const Rating_1 = require("../models/Rating");
const Image_1 = require("../models/Image");
const DailyReport_1 = require("../models/DailyReport");
const Patient_1 = require("../models/Patient");
const PatientDataSet_1 = require("../models/PatientDataSet");
const PatientData_1 = require("../models/PatientData");
const Note_1 = require("../models/Note");
const sequelizeConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
};
exports.sequelize = new sequelize_typescript_1.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
    host: sequelizeConfig.host,
    dialect: "postgres",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        freezeTableName: true,
        timestamps: true,
        underscored: true
    },
    models: [User_1.User, Profile_1.Profile, Message_1.Message, Conversation_1.Conversation, Image_1.Image, PriceListElement_1.PriceListElement, Rating_1.Rating, UserConversation_1.UserConversation],
    logging: false
});
exports.sequelize.addModels([User_1.User, Profile_1.Profile, Message_1.Message, Conversation_1.Conversation, Image_1.Image, PriceListElement_1.PriceListElement, Rating_1.Rating,
    UserConversation_1.UserConversation, DailyReport_1.DailyReport, Patient_1.Patient, PatientData_1.PatientData, PatientDataSet_1.PatientDataSet, Note_1.Note]);
//# sourceMappingURL=sequelize.js.map