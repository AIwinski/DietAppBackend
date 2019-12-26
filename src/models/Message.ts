import { Table, Column, Model, AllowNull, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Conversation } from './Conversation';

@Table
export class Message extends Model<Message> {

    @Column
    messageType: string;

    @Column
    text: string

    @Column
    srcPath: string

    @ForeignKey(() => User)
    @Column
    senderId: number;

    @BelongsTo(() => User)
    sender: User;

    @ForeignKey(() => Conversation)
    @Column
    conversationId: number;

    @BelongsTo(() => Conversation)
    conversation: Conversation;

}