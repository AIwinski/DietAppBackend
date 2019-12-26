import express from "express";
import passport from "passport";

const router = express.Router();

const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as ProfileController from "../controllers/profile";

router.get("/", ProfileController.getProfiles);

router.post("/", passportJWTverify, ProfileController.addNewProfile);

router.post("/price-list-element", passportJWTverify, ProfileController.addPriceListElement)

router.delete("/price-list-element/:id", passportJWTverify, ProfileController.deletePriceListElement)

router.put("/user", passportJWTverify, ProfileController.updateUser);

router.get("/avatar-reset", passportJWTverify, ProfileController.resetAvatar)

router.post("/review", passportJWTverify, ProfileController.addReview);

router.get("/:id", ProfileController.getProfileById);

router.put("/:id", passportJWTverify, ProfileController.updateProfile);

router.delete("/image/:id", passportJWTverify, ProfileController.deleteImage)

export { router }