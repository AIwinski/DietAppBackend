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
const User_1 = require("./User");
const Profile_1 = require("./Profile");
let Rating = class Rating extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Rating.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Rating.prototype, "ratingValue", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Rating.prototype, "authorId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User),
    __metadata("design:type", User_1.User)
], Rating.prototype, "author", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Profile_1.Profile),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Rating.prototype, "profileId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Profile_1.Profile),
    __metadata("design:type", Profile_1.Profile)
], Rating.prototype, "profile", void 0);
Rating = __decorate([
    sequelize_typescript_1.Table
], Rating);
exports.Rating = Rating;
//# sourceMappingURL=Rating.js.map