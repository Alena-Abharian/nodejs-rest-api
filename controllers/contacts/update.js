const {HttpError} = require("../../helpers");
const {Contact, schemas} = require('../../models/contact');

const update = async (req, res, next) => {
    try {
        const {error} = schemas.addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const {contactId} = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
        if (!result) {
            throw HttpError(404);
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = update;