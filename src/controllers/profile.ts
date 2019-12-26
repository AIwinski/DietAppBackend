import { Request, Response, NextFunction } from "express";
import { getAllProfileData, deletePriceListElementById, addPriceListElementByProfileId, findFilteredProfiles, deleteImageById, resetAvatar as resetUserAvatar, updateDailyReport } from "../repository/profile";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { Rating } from "../models/Rating";


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

export { getProfiles, addNewProfile, getProfileById, deletePriceListElement, addPriceListElement, updateProfile, deleteImage, resetAvatar, updateUser, addReview }