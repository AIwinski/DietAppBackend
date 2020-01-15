import { Table, Model, Column, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { PatientDataSet } from './PatientDataSet'

@Table
export class PatientData extends Model<PatientData> {

    @Column
    dataType: string;

    @Column
    stringValue: string;

    @Column
    numberValue: number;

    @ForeignKey(() => PatientDataSet)
    @Column
    dataSetId: number;

    @BelongsTo(() => PatientDataSet)
    dataSet: PatientDataSet;
}