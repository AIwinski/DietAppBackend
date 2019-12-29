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
const Conversation_1 = require("./Conversation");
let Message = class Message extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "messageType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "srcPath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "initialFileName", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "senderId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User),
    __metadata("design:type", User_1.User)
], Message.prototype, "sender", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Conversation_1.Conversation),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "conversationId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Conversation_1.Conversation),
    __metadata("design:type", Conversation_1.Conversation)
], Message.prototype, "conversation", void 0);
Message = __decorate([
    sequelize_typescript_1.Table
], Message);
exports.Message = Message;
//# sourceMappingURL=Message.js.map