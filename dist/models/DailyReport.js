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
const Profile_1 = require("./Profile");
let DailyReport = class DailyReport extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyReport.prototype, "summary", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Profile_1.Profile),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyReport.prototype, "profileId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Profile_1.Profile),
    __metadata("design:type", Profile_1.Profile)
], DailyReport.prototype, "profile", void 0);
DailyReport = __decorate([
    sequelize_typescript_1.Table
], DailyReport);
exports.DailyReport = DailyReport;
//# sourceMappingURL=DailyReport.js.map