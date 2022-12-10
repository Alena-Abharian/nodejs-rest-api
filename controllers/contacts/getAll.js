const {Contact} = require('../../models/contact');

// if you need to return special fields
//  const result = await Contact.find({}, "name email");

// if you need to remove special fields
//  const result = await Contact.find({}, "-createdAt, -updateAt");

const getAll = async (req, res, next) => {
    try {
        const {_id: owner} = req.user;
        const {page = 1, limit = 20} = req.query;
        const skip = (page - 1) * limit;

        const result = await Contact
            .find({owner})
            .skip(skip)
            .limit(limit)
            .populate('owner', 'email');

        res.json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = getAll;