import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { PriceListElement } from "../models/PriceListElement";
import { Rating } from "../models/Rating";
import { Image } from "../models/Image";
import Sequelize, { Op } from "sequelize";
import { DailyReport } from "../models/DailyReport";

const createNewProfile = async (userId: string) => {
    await Profile.create({
        ownerId: userId,
        popularity: 0,
        totalRating: 0,
    });
}

const findFilteredProfiles = async (batchSize: number, alreadyFetched: number, filters: any) => {
    let profiles = await Profile.findAll({
        limit: batchSize, offset: alreadyFetched,
        include: [Rating, User, Image, PriceListElement]
    });
    profiles = profiles.filter(p => {
        p.city === filters.city;
    });
    if(filters.services) {
        profiles = profiles.filter(p => {
            let result = false;
            p.city === filters.city;
        });
    }
    

    return profiles;
}

const getAllProfileData = async (profileId: string) => {
    return Profile.findByPk(profileId, { include: [{ model: User, attributes: ['id', 'email', 'displayName', 'avatar', 'createdAt', 'updatedAt'] }, Image, { model: Rating, include: [User] }, PriceListElement] });
}

const deletePriceListElementById = async (elementId: string) => {
    return PriceListElement.destroy({ where: { id: elementId } });
}

const addPriceListElementByProfileId = async (profileId: string, elementName: string, price: number) => {
    return PriceListElement.create({ profileId, elementName, price });
}

const deleteImageById = async (elementId: string) => {
    return Image.destroy({ where: { id: elementId } });
}

const resetAvatar = async (userId: string) => {
    User.findByPk(userId).then(u => {
        u.avatar = "";
        return u.save();
    })
}

const updateDailyReport = async (profileId: string) => {
    const oneDay = 86400000;
    const currentDate = Date.now() - (Date.now() % 86400000);
    DailyReport.findOne({
        where: {
            profileId: profileId,
            createdAt: {
                [Op.gte]: currentDate,
                [Op.lte]: currentDate + oneDay
            }
        }
    }).then(dr => {
        if (!dr) {
            return DailyReport.create({
                summary: 1,
                profileId: profileId
            })
        }

        dr.summary = dr.summary + 1;
        return dr.save()
    })
}

export { createNewProfile, getAllProfileData, addPriceListElementByProfileId, deletePriceListElementById, findFilteredProfiles, deleteImageById, resetAvatar, updateDailyReport }