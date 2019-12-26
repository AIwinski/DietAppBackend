import { Table, Model, HasMany, BelongsToMany, Column } from 'sequelize-typescript';
import { Message } from './Message';
import { User } from './User';
import { UserConversation } from './UserConversation';

@Table
export class Conversation extends Model<Conversation> {

    @HasMany(() => Message)
    messages: Message[];

    @BelongsToMany(() => User, () => UserConversation)
    users: User[];
}