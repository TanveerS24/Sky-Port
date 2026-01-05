import UserTypes from '../models/userTypes.model.js';

const createUserType = async (req, res) => {
    console.log("createUserType invoked");
    try {
        const { type } = req.body;
        const newUserType = new UserTypes({ type });
        await newUserType.save();
        res.status(201).json(newUserType);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user type', error });
    }
};

export default createUserType;