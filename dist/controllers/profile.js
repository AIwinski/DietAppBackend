"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = require("../repository/profile");
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const Rating_1 = require("../models/Rating");
const sequelize_1 = require("sequelize");
const DailyReport_1 = require("../models/DailyReport");
const getProfiles = (req, res, next) => {
    let alreadyFetched = parseInt(req.query.already_fetched) || 0;
    let batchSize = parseInt(req.query.batch_size) || 5;
    let filters;
    try {
        alreadyFetched = parseInt(req.query.already_fetched);
    }
    catch (_a) {
        alreadyFetched = 0;
    }
    try {
        batchSize = parseInt(req.query.batch_size);
    }
    catch (_b) {
        batchSize = 5;
    }
    try {
        filters = JSON.parse(req.query.filters);
        console.log(filters);
    }
    catch (_c) {
        filters = {};
    }
    profile_1.findFilteredProfiles(batchSize, alreadyFetched, filters).then(profiles => {
        profiles.forEach(p => {
            let rating = 0;
            p.ratings.forEach(r => {
                rating += r.ratingValue;
            });
            if (p.ratings.length) {
                rating = rating / p.ratings.length;
            }
            p.totalRating = rating;
        });
        return res.status(200).json({ profiles });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getProfiles = getProfiles;
const addNewProfile = (req, res, next) => {
};
exports.addNewProfile = addNewProfile;
const getProfileById = (req, res, next) => {
    const id = req.params.id;
    profile_1.getAllProfileData(id).then(result => {
        if (!result) {
            return res.status(404).json({ message: "Profile not found" });
        }
        let rating = 0;
        result.ratings.forEach(r => {
            rating += r.ratingValue;
        });
        if (result.ratings.length) {
            rating = rating / result.ratings.length;
        }
        result.totalRating = rating;
        profile_1.updateDailyReport(id);
        return res.status(200).json({ profile: result });
    }).catch(err => {
        return res.status(500).json({ err });
    });
};
exports.getProfileById = getProfileById;
const updateUser = (req, res, next) => {
    const id = req.user.id;
    User_1.User.findByPk(id).then(u => {
        if (!u) {
            return res.status(404).json({ message: "Not found" });
        }
        u.displayName = req.body.displayName ? req.body.displayName : u.displayName;
        u.save().then(user => {
            return res.status(201).json({ user: user });
        }).catch(err => {
            return res.status(500).json({ err });
        });
    });
};
exports.updateUser = updateUser;
const updateProfile = (req, res, next) => {
    const id = req.params.id;
    Profile_1.Profile.findByPk(id).then(p => {
        if (!p) {
            return res.status(404).json({ message: "Not found" });
        }
        p.descr = req.body.descr ? req.body.descr : p.descr;
        p.city = req.body.city ? req.body.city : p.city;
        p.save().then(profile => {
            return res.status(201).json({ profile });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        });
    });
};
exports.updateProfile = updateProfile;
const deletePriceListElement = (req, res, next) => {
    const id = req.params.id;
    profile_1.deletePriceListElementById(id).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err });
    });
};
exports.deletePriceListElement = deletePriceListElement;
const addPriceListElement = (req, res, next) => {
    const id = req.body.profileId;
    const elementName = req.body.elementName;
    const price = req.body.price;
    profile_1.addPriceListElementByProfileId(id, elementName, price).then(result => {
        return res.status(200).json({ priceListElement: result });
    }).catch(err => {
        return res.status(500).json({ err });
    });
};
exports.addPriceListElement = addPriceListElement;
const deleteImage = (req, res, next) => {
    const id = req.params.id;
    profile_1.deleteImageById(id).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err });
    });
};
exports.deleteImage = deleteImage;
const resetAvatar = (req, res, next) => {
    const id = req.user.id;
    profile_1.resetAvatar(id).then(u => {
        console.log(u);
        return res.status(201).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err: err });
    });
};
exports.resetAvatar = resetAvatar;
const addReview = (req, res, next) => {
    const id = req.body.profileId;
    Profile_1.Profile.findByPk(id).then(p => {
        if (!p) {
            return res.status(404).json({ message: "Not found" });
        }
        const userId = req.user.id;
        Rating_1.Rating.create({
            content: req.body.content,
            ratingValue: req.body.ratingValue,
            authorId: userId,
            profileId: id
        }).then(rating => {
            Rating_1.Rating.findByPk(rating.id, { include: [User_1.User] }).then(r => {
                return res.status(200).json({ rating: r });
            });
        }).catch(err => {
            return res.status(500).json({ err });
        });
    });
};
exports.addReview = addReview;
const updateReview = (req, res, next) => {
    const id = req.body.reviewId;
    const ratingValue = req.body.ratingValue;
    const content = req.body.content;
    Rating_1.Rating.findByPk(id).then(r => {
        if (!r) {
            return res.status(404).json({ message: "Not found" });
        }
        r.ratingValue = ratingValue;
        r.content = content;
        r.save().then(result => {
            return res.status(200).json({ rating: result });
        });
    }).catch(err => {
        return res.status(500).json({ error: err });
    });
};
exports.updateReview = updateReview;
const search = (req, res, next) => {
    const phrase = req.params.phrase ? req.params.phrase.toLowerCase() : "";
    if (!phrase) {
        return res.status(400).json({ message: "Search phrase cannot be empty" });
    }
    Profile_1.Profile.findAll({ include: [User_1.User] }).then(profiles => {
        let filtered = [];
        profiles.forEach(p => {
            if (p.city.toLowerCase().includes(phrase)) {
                filtered.push(p);
            }
        });
        profiles.forEach(p => {
            if (p.owner.displayName.toLowerCase().includes(phrase)) {
                filtered.push(p);
            }
        });
        profiles.forEach(p => {
            if (p.descr.toLowerCase().includes(phrase)) {
                filtered.push(p);
            }
        });
        const result = filtered.filter((item, pos) => {
            return filtered.map(f => f.id).indexOf(item.id) === pos;
        });
        return res.status(200).json({ result: result.slice(0, 5) });
    }).catch(err => {
        return res.status(500).json({ error: err });
    });
};
exports.search = search;
const count = (req, res, next) => {
    Profile_1.Profile.count().then(result => {
        return res.status(200).json({ count: result });
    }).catch(err => {
        return res.status(500).json({ error: err });
    });
};
exports.count = count;
const mostRecent = (req, res, next) => {
    Profile_1.Profile.findAll({ order: [['created_at', "ASC"]], limit: 3, include: [User_1.User, Rating_1.Rating] }).then(result => {
        result.forEach(p => {
            let rating = 0;
            p.ratings.forEach(r => {
                rating += r.ratingValue;
            });
            if (p.ratings.length) {
                rating = rating / p.ratings.length;
            }
            p.totalRating = rating;
        });
        return res.status(200).json({ result: result });
    }).catch(err => {
        return res.status(500).json({ error: err });
    });
};
exports.mostRecent = mostRecent;
const getReport = (req, res, next) => {
    const oneDay = 86400000;
    let days = 0;
    try {
        days = Number(req.query.days);
    }
    catch (_a) {
        days = 7;
    }
    const profileId = req.query.profile;
    let report = [];
    const from = Date.now() - (Date.now() % oneDay) - oneDay * days;
    DailyReport_1.DailyReport.findAll({
        where: {
            profileId: profileId,
            createdAt: {
                [sequelize_1.Op.gte]: from
            }
        },
        order: [["createdAt", "ASC"]]
    }).then(reports => {
        for (let i = 0; i < days; i++) {
            let currentDay = Date.now() - (Date.now() % oneDay) - oneDay * i;
            let r = reports.find(r => r.createdAt >= currentDay && r.createdAt <= currentDay + oneDay);
            let rep;
            if (r) {
                rep = {
                    day: currentDay,
                    summary: r.summary
                };
            }
            else {
                rep = {
                    day: currentDay,
                    summary: 0
                };
            }
            report.push(rep);
        }
        return res.status(200).json({ report: report });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getReport = getReport;
//# sourceMappingURL=profile.js.map