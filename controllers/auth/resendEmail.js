const {User, schemas} = require('../../models/user');

const {HttpError, sendEmail} = require('../../helpers');

const {BASE_URL} = process.env;

const resendEmail = async (req, res, next) => {
    try {
        const {error} = schemas.verifySchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            throw HttpError(404);
        }
        const mail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify</a>`
        }
        await sendEmail(mail);
        res.json({
            message: "Verification email sent",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = resendEmail;