"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Patient_1 = require("../models/Patient");
const User_1 = require("../models/User");
const Note_1 = require("../models/Note");
const PatientDataSet_1 = require("../models/PatientDataSet");
const PatientData_1 = require("../models/PatientData");
const getPatientList = (req, res, next) => {
    const userId = req.user.id;
    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can fetch patients list." });
    }
    Patient_1.Patient.findAll({ where: { doctorId: userId } }).then(patients => {
        return res.status(200).json({ patients });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getPatientList = getPatientList;
const addPatient = (req, res, next) => {
    const userId = req.user.id;
    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can add patient." });
    }
    const { therapyGoal, age, gender, firstName, lastName, userAccountId } = req.body;
    Patient_1.Patient.create({ therapyGoal, age, gender, firstName, lastName, doctorId: userId, userAccountId }).then(patient => {
        return res.status(201).json({ patient });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.addPatient = addPatient;
const getUser = (req, res, next) => {
    const id = req.params.id;
    User_1.User.findByPk(id).then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getUser = getUser;
const addNote = (req, res, next) => {
    const userId = req.user.id;
    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can add patient." });
    }
    const content = req.body.content;
    const patientId = req.body.patientId || null;
    Note_1.Note.create({ content, doctorId: userId, patientId }).then(note => {
        return res.status(201).json({ note });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.addNote = addNote;
const deleteNote = (req, res, next) => {
    const userId = req.user.id;
    const id = req.params.id;
    Note_1.Note.destroy({
        where: {
            doctorId: userId,
            id: id
        }
    }).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.deleteNote = deleteNote;
const getNotes = (req, res, next) => {
    const userId = req.user.id;
    const patientId = req.params.id || null;
    Note_1.Note.findAll({
        where: {
            doctorId: userId,
            patientId: patientId
        }
    }).then((notes) => {
        return res.status(200).json({ notes });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getNotes = getNotes;
const getPatient = (req, res, next) => {
    const userId = req.user.id;
    const patientId = req.params.id;
    Patient_1.Patient.findOne({
        where: { id: patientId, doctorId: userId },
        include: [{ model: User_1.User, as: 'userAccount' }, { model: User_1.User, as: 'doctor' }]
    }).then((patient) => {
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({ patient });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getPatient = getPatient;
const getDataSets = (req, res, next) => {
    const userId = req.user.id;
    const patientId = req.params.id;
    PatientDataSet_1.PatientDataSet.findAll({
        where: {
            doctorId: userId,
            patientId: patientId,
        }
    }).then((dataSets) => __awaiter(void 0, void 0, void 0, function* () {
        const allSets = yield Promise.all(dataSets.map((ds) => __awaiter(void 0, void 0, void 0, function* () {
            const dataValues = (yield PatientData_1.PatientData.findAll({ where: { dataSetId: ds.id } }));
            return {
                dataValues: dataValues,
                dataSet: ds
            };
        })));
        return res.status(200).json({ dataSets: allSets });
    })).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.getDataSets = getDataSets;
const addDataSet = (req, res, next) => {
    const userId = req.user.id;
    const patientId = req.params.id;
    const { title, descr, unit, dataType } = req.body;
    PatientDataSet_1.PatientDataSet.create({
        doctorId: userId,
        patientId: patientId,
        title, descr, unit, dataType
    }).then(dataSet => {
        return res.status(201).json({
            dataSet: {
                dataSet: dataSet,
                dataValues: []
            }
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.addDataSet = addDataSet;
const removeDataSet = (req, res, next) => {
    const userId = req.user.id;
    const id = req.params.id;
    PatientDataSet_1.PatientDataSet.findOne({
        where: {
            doctorId: userId,
            id: id
        }
    }).then(result => {
        if (result) {
            PatientData_1.PatientData.destroy({
                where: {
                    dataSetId: result.id
                }
            }).then(() => {
                PatientDataSet_1.PatientDataSet.destroy({
                    where: {
                        doctorId: userId,
                        id: id
                    }
                }).then(() => {
                    return res.status(200).json({ success: true });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: err });
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ error: err });
            });
        }
        else {
            return res.status(404).json({ message: "Data set not found" });
        }
    });
};
exports.removeDataSet = removeDataSet;
const addDataValue = (req, res, next) => {
    const userId = req.user.id;
    PatientDataSet_1.PatientDataSet.findOne({
        where: {
            doctorId: userId
        }
    }).then(dataSet => {
        if (!dataSet) {
            return res.status(403).json({ message: "This doctor does not own data set with such id" });
        }
        const { dataSetId, dataValue, dateValue } = req.body;
        PatientData_1.PatientData.create({
            dataSetId, dataValue, dateValue
        }).then(patientData => {
            return res.status(201).json({ patientData });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: err });
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.addDataValue = addDataValue;
const removeDataValue = (req, res, next) => {
    const userId = req.user.id;
    const dataValueId = req.params.id;
    PatientData_1.PatientData.destroy({
        where: {
            id: dataValueId
        }
    }).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
    });
};
exports.removeDataValue = removeDataValue;
//# sourceMappingURL=patient.js.map