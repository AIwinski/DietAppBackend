import { Sequelize } from 'sequelize-typescript';

import { User } from "../models/User";
import { Profile } from '../models/Profile';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import { PriceListElement } from '../models/PriceListElement';
import { UserConversation } from '../models/UserConversation';
import { Rating } from '../models/Rating';
import { Image } from '../models/Image';
import { DailyReport } from '../models/DailyReport';
import { Patient } from '../models/Patient';
import { PatientDataSet } from '../models/PatientDataSet';
import { PatientData } from '../models/PatientData';
import { Note } from '../models/Note';

const sequelizeConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
}

export const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
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
    models: [User, Profile, Message, Conversation, Image, PriceListElement, Rating, UserConversation],
    logging: false
})

sequelize.addModels([User, Profile, Message, Conversation, Image, PriceListElement, Rating,
    UserConversation, DailyReport, Patient, PatientData, PatientDataSet, Note]);
