import Joi from "joi";

const authSchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .max(100)
        .required(),
    displayName: Joi.string()
        .min(2)
        .max(100)
        .required(),
    accountType: Joi.string().only(['doctor', 'patient'])
});

export { authSchema };