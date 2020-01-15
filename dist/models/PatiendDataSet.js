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
var Patient_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Patient_2 = require("./Patient");
exports.Patient = Patient_2.Patient;
let Patient = Patient_1 = class Patient extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Patient_2.Patient.prototype, "therapyGoal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Patient_2.Patient.prototype, "age", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Patient_2.Patient.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Patient_2.Patient.prototype, "firstName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Patient_2.Patient.prototype, "lastName", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Patient_2.Patient.prototype, "doctorId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User),
    __metadata("design:type", User_1.User)
], Patient_2.Patient.prototype, "doctor", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Patient_1),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Patient_2.Patient.prototype, "patientId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Patient_1),
    __metadata("design:type", Patient_2.Patient)
], Patient_2.Patient.prototype, "patient", void 0);
Patient = Patient_1 = __decorate([
    sequelize_typescript_1.Table
], Patient);
exports.Patient = Patient;
//# sourceMappingURL=PatiendDataSet.js.map