import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, BeforeSave } from 'sequelize-typescript';
import { Profile } from './Profile';

@Table
export class DailyReport extends Model<DailyReport> {

    @Column
    summary: number;

    @ForeignKey(() => Profile)
    @Column
    profileId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}
