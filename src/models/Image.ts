import { Table, Column, Model, AllowNull, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Profile } from './Profile';

@Table
export class Image extends Model<Image> {
    @Column
    srcPath: string;
    
    @ForeignKey(() => Profile)
    @Column
    profileId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}