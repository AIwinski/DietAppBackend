import { Table, Column, Model, AllowNull, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Profile } from './Profile';

@Table
export class Rating extends Model<Rating> {

    @Column
    content: string;

    @Column
    ratingValue: number;

    @ForeignKey(() => User)
    @Column
    authorId: number;

    @BelongsTo(() => User)
    author: User;

    @ForeignKey(() => Profile)
    @Column
    profileId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}