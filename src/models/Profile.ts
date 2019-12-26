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

    @BeforeSave
    static countCompletionRate(instance: Profile) {
        let completionRate = 0;
        if(instance.descr.length > 0){
            completionRate += 1;
        }
        if(instance.city.length > 0){
            completionRate += 1;
        }
        // completionRate += instance.images.length;
        // completionRate += instance.priceListElements.length;

        instance.accountCompletionRate = completionRate;
    }
}
