import { Table, Column, Model, IsEmail, Default, AllowNull, HasMany, BelongsToMany, DataType, HasOne, BeforeSave } from 'sequelize-typescript';
import { Message } from './Message';
import { Conversation } from './Conversation';
import { UserConversation } from './UserConversation';
import { Profile } from './Profile';

@Table
export class User extends Model<User> {

  @IsEmail
  @Column
  email: string;

  @Column
  passwd: string;

  @Column
  authType: string;

  @Column
  authProvider: string;

  @Column
  externalProviderId: string;

  @AllowNull(false)
  @Column
  displayName: string;

  @Column
  avatar: string;

  @Column
  accountVerificationToken: string;

  @Column
  accountType: string;

  @Default(false)
  @Column
  isActive: boolean;

  @HasOne(() => Profile)
  profile: Profile;

  @HasMany(() => Message)
  messages: Message[];

  @BelongsToMany(() => Conversation, () => UserConversation)
  conversations: Conversation[];
}