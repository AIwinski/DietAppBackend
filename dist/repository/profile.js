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
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const PriceListElement_1 = require("../models/PriceListElement");
const Rating_1 = require("../models/Rating");
const Image_1 = require("../models/Image");
const sequelize_1 = require("sequelize");
const DailyReport_1 = require("../models/DailyReport");
const createNewProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Profile_1.Profile.create({
        ownerId: userId,
        popularity: 0,
        totalRating: 0,
    });
});
exports.createNewProfile = createNewProfile;
const findFilteredProfiles = (batchSize, alreadyFetched, filters) => __awaiter(void 0, void 0, void 0, function* () {
    let filterObject = {};
    if (filters.priceRange.min && filters.priceRange.max) {
    }
    if (filters.city && filters.city !== "All") {
        // @ts-ignore
        filterObject.city = filters.city;
    }
    const MINIMUM_ACCOUNT_COMPLETION_RATE = 0;
    return Profile_1.Profile.findAll({
        limit: batchSize, offset: alreadyFetched,
        where: Object.assign({}, filterObject),
        include: [Rating_1.Rating, User_1.User, Image_1.Image, PriceListElement_1.PriceListElement]
    });
});
exports.findFilteredProfiles = findFilteredProfiles;
const getAllProfileData = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    return Profile_1.Profile.findByPk(profileId, { include: [{ model: User_1.User, attributes: ['id', 'email', 'displayName', 'avatar', 'createdAt', 'updatedAt'] }, Image_1.Image, { model: Rating_1.Rating, include: [User_1.User] }, PriceListElement_1.PriceListElement] });
});
exports.getAllProfileData = getAllProfileData;
const deletePriceListElementById = (elementId) => __awaiter(void 0, void 0, void 0, function* () {
    return PriceListElement_1.PriceListElement.destroy({ where: { id: elementId } });
});
exports.deletePriceListElementById = deletePriceListElementById;
const addPriceListElementByProfileId = (profileId, elementName, price) => __awaiter(void 0, void 0, void 0, function* () {
    return PriceListElement_1.PriceListElement.create({ profileId, elementName, price });
});
exports.addPriceListElementByProfileId = addPriceListElementByProfileId;
const deleteImageById = (elementId) => __awaiter(void 0, void 0, void 0, function* () {
    return Image_1.Image.destroy({ where: { id: elementId } });
});
exports.deleteImageById = deleteImageById;
const resetAvatar = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.User.findByPk(userId).then(u => {
        u.avatar = "";
        return u.save();
    });
});
exports.resetAvatar = resetAvatar;
const updateDailyReport = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const oneDay = 86400000;
    const currentDate = Date.now() - (Date.now() % 86400000);
    DailyReport_1.DailyReport.findOne({
        where: {
            profileId: profileId,
            createdAt: {
                [sequelize_1.Op.gte]: currentDate,
                [sequelize_1.Op.lte]: currentDate + oneDay
            }
        }
    }).then(dr => {
        if (!dr) {
            return DailyReport_1.DailyReport.create({
                summary: 1,
                profileId: profileId
            });
        }
        dr.summary = dr.summary + 1;
        return dr.save();
    });
});
exports.updateDailyReport = updateDailyReport;
//# sourceMappingURL=profile.js.map