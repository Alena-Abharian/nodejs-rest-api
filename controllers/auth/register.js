const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const {nanoid} = require('nanoid');

const {User, schemas} = require('../../models/user');

const {HttpError, sendEmail} = require('../../helpers');

const {BASE_URL} = process.env;

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
        const avatarURL = gravatar.url(email);

        const verificationToken = nanoid()

        const newUser = await User.create({email, password: hashPassword, subscription, avatarURL, verificationToken});

        const mail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify</a>`
        }

        await sendEmail(mail)

        res.status(201).json({
            email: newUser.email,
            subscription: newUser.subscription,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = register;