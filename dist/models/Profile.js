"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Image_1 = require("./Image");
const User_1 = require("./User");
const Rating_1 = require("./Rating");
const PriceListElement_1 = require("./PriceListElement");
let Profile = class Profile extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Profile.prototype, "descr", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Profile.prototype, "city", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Profile.prototype, "popularity", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Profile.prototype, "totalRating", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Profile.prototype, "accountCompletionRate", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Profile.prototype, "ownerId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User),
    __metadata("design:type", User_1.User)
], Profile.prototype, "owner", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Image_1.Image),
    __metadata("design:type", Array)
], Profile.prototype, "images", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Rating_1.Rating),
    __metadata("design:type", Array)
], Profile.prototype, "ratings", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => PriceListElement_1.PriceListElement),
    __metadata("design:type", Array)
], Profile.prototype, "priceListElements", void 0);
Profile = __decorate([
    sequelize_typescript_1.Table
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=Profile.js.map