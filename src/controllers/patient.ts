import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/Patient";
import { User } from "../models/User";
import { Note } from "../models/Note";
import { PatientDataSet } from "../models/PatientDataSet";
import { PatientData } from "../models/PatientData";

const getPatientList = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can fetch patients list." })
    }

    Patient.findAll({ where: { doctorId: userId } }).then(patients => {
        return res.status(200).json({ patients });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    })
}

const addPatient = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can add patient." })
    }
    const { therapyGoal, age, gender, firstName, lastName, userAccountId } = req.body;

    Patient.create({ therapyGoal, age, gender, firstName, lastName, doctorId: userId, userAccountId }).then(patient => {
        return res.status(201).json({ patient });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    })
}

const getUser = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    User.findByPk(id).then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err });
    })
}

const addNote = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    if (req.user.accountType !== 'doctor') {
        return res.status(403).json({ message: "Only doctor can add patient." })
    }

    const content = req.body.content;
    const patientId = req.body.patientId || null;

    Note.create({ content, doctorId: userId, patientId }).then(note => {
        return res.status(201).json({ note });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    })
}

const deleteNote = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const id = req.params.id;

    Note.destroy({
        where: {
            doctorId: userId,
            id: id
        }
    }).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const getNotes = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const patientId = req.params.id || null;

    Note.findAll({
        where: {
            doctorId: userId,
            patientId: patientId
        }
    }).then((notes) => {
        return res.status(200).json({ notes });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const getPatient = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const patientId = req.params.id;

    Patient.findOne({
        where: { id: patientId, doctorId: userId },
        include: [{ model: User, as: 'userAccount' }, { model: User, as: 'doctor' }]
    }).then((patient) => {
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" })
        }
        return res.status(200).json({ patient });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const getDataSets = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const patientId = req.params.id;

    PatientDataSet.findAll({
        where: {
            doctorId: userId,
            patientId: patientId,
        }
    }).then(async (dataSets) => {
        const allSets = await Promise.all(dataSets.map(async ds => {
            const dataValues = await PatientData.findAll({ where: { dataSetId: ds.id } });
            return {
                dataValues: dataValues,
                dataSet: ds
            };
        }))
        return res.status(200).json({ dataSets: allSets });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const addDataSet = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const patientId = req.params.id;

    const { title, descr, unit, dataType } = req.body;

    PatientDataSet.create({
        doctorId: userId,
        patientId: patientId,
        title, descr, unit, dataType
    }).then(dataSet => {
        return res.status(201).json({ dataSet })
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const removeDataSet = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const id = req.params.id;

    PatientDataSet.destroy({
        where: {
            doctorId: userId,
            id: id
        }
    }).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const addDataValue = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    PatientDataSet.findOne({
        where: {
            doctorId: userId
        }
    }).then(dataSet => {
        if (!dataSet) {
            return res.status(403).json({ message: "This doctor does not own data set with such id" })
        }

        const { dataSetId, dataValue, dateValue } = req.body;

        PatientData.create({
            dataSetId, dataValue, dateValue
        }).then(patientData => {
            return res.status(201).json({ patientData })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

const removeDataValue = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const dataValueId = req.params.id;

    PatientData.destroy({
        where: {
            id: dataValueId
        }
    }).then(() => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: err })
    });
}

export {
    getPatientList, addPatient, getUser, addNote, deleteNote, getNotes, getPatient,
    getDataSets, addDataSet, removeDataSet, addDataValue, removeDataValue
}
