import { Table, Model, Column, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from './User';

@Table
export class Patient extends Model<Patient> {

    @Column
    therapyGoal: string;

    @Column
    age: number;

    @Column
    gender: string;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @ForeignKey(() => User)
    @Column
    doctorId: number;

    @BelongsTo(() => User, 'doctorId')
    doctor: User;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    userAccountId: number;

    @BelongsTo(() => User, 'userAccountId')
    userAccount: User;
}