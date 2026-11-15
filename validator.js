
const Joi = require('joi');

const todoSchema = Joi.object({
    task: Joi.string().trim().min(3).required()
});

function validateTodo(req, res, next) {
    const { error } = todoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    next();
}

module.exports = validateTodo;
