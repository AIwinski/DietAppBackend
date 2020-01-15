import { Table, Model, Column, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from './User';
import { Patient } from './Patient'

@Table
export class Note extends Model<Note> {

    @Column
    content: string;

    @ForeignKey(() => User)
    @Column
    doctorId: number;

    @BelongsTo(() => User)
    doctor: User;

    @ForeignKey(() => Patient)
    @Column
    patientId: number;

    @BelongsTo(() => Patient)
    patient: Patient;
}