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
const PatientDataSet_1 = require("./PatientDataSet");
let PatientData = class PatientData extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], PatientData.prototype, "dataType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], PatientData.prototype, "stringValue", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PatientData.prototype, "numberValue", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => PatientDataSet_1.PatientDataSet),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PatientData.prototype, "dataSetId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => PatientDataSet_1.PatientDataSet),
    __metadata("design:type", PatientDataSet_1.PatientDataSet)
], PatientData.prototype, "dataSet", void 0);
PatientData = __decorate([
    sequelize_typescript_1.Table
], PatientData);
exports.PatientData = PatientData;
//# sourceMappingURL=PatientData.js.map