import { Table, Model, Column, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { PatientDataSet } from './PatientDataSet'

@Table
export class PatientData extends Model<PatientData> {

    @Column
    dataValue: number;

    @Column
    dateValue: Date;

    @ForeignKey(() => PatientDataSet)
    @Column
    dataSetId: number;

    @BelongsTo(() => PatientDataSet)
    dataSet: PatientDataSet;
}