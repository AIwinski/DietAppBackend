import { Table, Column, Model, AllowNull, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Profile } from './Profile';

@Table
export class PriceListElement extends Model<PriceListElement> {

    @Column
    elementName: string;

    @Column
    price: number;

    @ForeignKey(() => Profile)
    @Column
    profileId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}