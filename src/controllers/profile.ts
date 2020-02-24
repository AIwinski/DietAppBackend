import { Request, Response, NextFunction } from "express";
import { getAllProfileData, deletePriceListElementById, addPriceListElementByProfileId, findFilteredProfiles, deleteImageById, resetAvatar as resetUserAvatar, updateDailyReport } from "../repository/profile";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Rating } from "../models/Rating";
import { Op } from "sequelize";
import { DailyReport } from "../models/DailyReport";


const getProfiles = (req: Request, res: Response, next: NextFunction) => {
    let alreadyFetched = parseInt(req.query.already_fetched) || 0;
    let batchSize = parseInt(req.query.batch_size) || 5;
    let filters;
    try {
        alreadyFetched = parseInt(req.query.already_fetched);
    } catch {
        alreadyFetched = 0;
    }
    try {
        batchSize = parseInt(req.query.batch_size);
    } catch {
        batchSize = 5;
    }
    try {
        filters = JSON.parse(req.query.filters)
        console.log(filters)
    } catch {
        filters = {}
    }
    findFilteredProfiles(batchSize, alreadyFetched, filters).then(profiles => {
        profiles.forEach(p => {
            let rating = 0;
            p.ratings.forEach(r => {
                rating += r.ratingValue;
            })
            if (p.ratings.length) {
                rating = rating / p.ratings.length;
            }
            p.totalRating = rating;
        })
        return res.status(200).json({ profiles });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err });
    })
}

const addNewProfile = (req: Request, res: Response, next: NextFunction) => {

}

const getProfileById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    getAllProfileData(id).then(result => {
        if (!result) {
            return res.status(404).json({ message: "Profile not found" });
        }
        let rating = 0;
        result.ratings.forEach(r => {
            rating += r.ratingValue;
        })
        if (result.ratings.length) {
            rating = rating / result.ratings.length;
        }
        result.totalRating = rating;
        updateDailyReport(id)
        return res.status(200).json({ profile: result });
    }).catch(err => {
        return res.status(500).json({ err })
    });
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const id = req.user.id;
    User.findByPk(id).then(u => {
        if (!u) {
            return res.status(404).json({ message: "Not found" })
        }
        u.displayName = req.body.displayName ? req.body.displayName : u.displayName;
        u.save().then(user => {
            return res.status(201).json({ user: user })
        }).catch(err => {
            return res.status(500).json({ err })
        })
    })
}

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    Profile.findByPk(id).then(p => {
        if (!p) {
            return res.status(404).json({ message: "Not found" })
        }
        p.descr = req.body.descr ? req.body.descr : p.descr;
        p.city = req.body.city ? req.body.city : p.city;
        p.save().then(profile => {
            return res.status(201).json({ profile })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ err })
        })
    })
}


const deletePriceListElement = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    deletePriceListElementById(id).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err })
    });
}

const addPriceListElement = (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.profileId;
    const elementName = req.body.elementName;
    const price = req.body.price;

    addPriceListElementByProfileId(id, elementName, price).then(result => {
        return res.status(200).json({ priceListElement: result });
    }).catch(err => {
        return res.status(500).json({ err })
    });
}

const deleteImage = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    deleteImageById(id).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err })
    });
}

const resetAvatar = (req: Request, res: Response, next: NextFunction) => {
    const id = req.user.id;
    resetUserAvatar(id).then(u => {
        console.log(u)
        return res.status(201).json({ success: true });
    }).catch(err => {
        return res.status(500).json({ err: err })
    })
}

const addReview = (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.profileId;
    Profile.findByPk(id).then(p => {
        if (!p) {
            return res.status(404).json({ message: "Not found" })
        }
        const userId = req.user.id;

        Rating.create({
            content: req.body.content,
            ratingValue: req.body.ratingValue,
            authorId: userId,
            profileId: id
        }).then(rating => {
            Rating.findByPk(rating.id, { include: [User] }).then(r => {
                return res.status(200).json({ rating: r })
            })
        }).catch(err => {
            return res.status(500).json({ err })
        })
    })
}


const updateReview = (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.reviewId;
    const ratingValue = req.body.ratingValue;
    const content = req.body.content;
    Rating.findByPk(id).then(r => {
        if (!r) {
            return res.status(404).json({ message: "Not found" });
        }
        r.ratingValue = ratingValue;
        r.content = content;
        r.save().then(result => {
            return res.status(200).json({ rating: result })
        })
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
}

const search = (req: Request, res: Response, next: NextFunction) => {
    const phrase = req.params.phrase ? req.params.phrase.toLowerCase() : "";

    if (!phrase) {
        return res.status(400).json({ message: "Search phrase cannot be empty" });
    }

    Profile.findAll({ include: [User] }).then(profiles => {
        let filtered: Profile[] = [];
        profiles.forEach(p => {
            if (p.city.toLowerCase().includes(phrase)) {
                filtered.push(p)
            }
        });
        profiles.forEach(p => {
            if (p.owner.displayName.toLowerCase().includes(phrase)) {
                filtered.push(p)
            }
        });
        profiles.forEach(p => {
            if (p.descr.toLowerCase().includes(phrase)) {
                filtered.push(p)
            }
        });

        const result = filtered.filter((item, pos) => {
            return filtered.map(f => f.id).indexOf(item.id) === pos;
        });

        return res.status(200).json({ result: result.slice(0, 5) })
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
}

const count = (req: Request, res: Response, next: NextFunction) => {
    Profile.count().then(result => {
        return res.status(200).json({ count: result })
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
}

const mostRecent = (req: Request, res: Response, next: NextFunction) => {
    Profile.findAll({ order: [['created_at', "ASC"]], limit: 3, include: [User, Rating] }).then(result => {
        result.forEach(p => {
            let rating = 0;
            p.ratings.forEach(r => {
                rating += r.ratingValue;
            })
            if (p.ratings.length) {
                rating = rating / p.ratings.length;
            }
            p.totalRating = rating;
        })
        return res.status(200).json({ result: result })
    }).catch(err => {
        return res.status(500).json({ error: err })
    });
}

const getReport = (req: Request, res: Response, next: NextFunction) => {
    const oneDay = 86400000;
    let days = 0;
    try {
        days = Number(req.query.days);
    } catch {
        days = 7;
    }

    const profileId = req.query.profile;
    let report: any = [];
    const from = Date.now() - (Date.now() % oneDay) - oneDay * days;

    DailyReport.findAll({
        where: {
            profileId: profileId,
            createdAt: {
                [Op.gte]: from
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
                }
            } else {
                rep = {
                    day: currentDay,
                    summary: 0
                }
            }
            report.push(rep);
        }
        return res.status(200).json({ report: report });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    })
}



export {
    getProfiles, count, addNewProfile, getProfileById,
    deletePriceListElement, addPriceListElement, updateProfile,
    deleteImage, resetAvatar, updateUser, addReview, search, mostRecent, getReport, updateReview
}