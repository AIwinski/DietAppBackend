import { Table, Model, Column, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from './User';
import { Patient } from './Patient'

@Table
export class PatientDataSet extends Model<PatientDataSet> {

    @Column
    title: string;

    @Column
    descr: string;

    @Column
    unit: string;

    @Column
    dataType: string;

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