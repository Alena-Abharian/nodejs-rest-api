const bcrypt = require('bcryptjs');

const {User, schemas} = require('../../models/user');

const {HttpError} = require('../../helpers');

const register = async (req, res, next) => {
    try {
        const {error} = schemas.registerSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message)
        }
        const {email, password, subscription} = req.body;
        const user = await User.findOne({email});
        if (user) {
            throw HttpError(409, "Email in use");
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({email, password: hashPassword, subscription});
        res.status(201).json({
            email: newUser.email,
            subscription: newUser.subscription,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = register;