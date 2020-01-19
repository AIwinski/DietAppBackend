import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, BeforeSave } from 'sequelize-typescript';
import { Image } from './Image';
import { User } from './User';
import { Rating } from './Rating';
import { PriceListElement } from './PriceListElement';

@Table
export class Profile extends Model<Profile> {

    @Column
    descr: string;

    @Column
    city: string;

    @Column
    popularity: number;

    @Column
    totalRating: number;

    @Column
    accountCompletionRate: number;

    @ForeignKey(() => User)
    @Column
    ownerId: number;

    @BelongsTo(() => User)
    owner: User;

    @HasMany(() => Image)
    images: Image[];

    @HasMany(() => Rating)
    ratings: Rating[];

    @HasMany(() => PriceListElement)
    priceListElements: PriceListElement[];
}
