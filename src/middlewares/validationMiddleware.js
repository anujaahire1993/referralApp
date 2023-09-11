import Joi from 'joi';

const templateSchema = Joi.object({
    templateType: Joi.string().alphanum().required(),
    language: Joi.string().required(),
    templateId: Joi.string().alphanum().required(),
    subject: Joi.string().alphanum().required(),
    senderName: Joi.string().required(),
    senderEmail: Joi.string().email().required(),
    personalization: Joi.object({
        email: Joi.string().email().required(),
        data: Joi.object().required()  // Define the structure of the 'data' object here
    })
});

export function validateTemplate(req, res, next) {
    const { error } = templateSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    referralCode: Joi.string().required(),
    role: Joi.string().required(),
    personalization: Joi.string(),
});

export function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

export default {
    validateTemplate,
    validateUser,
};
