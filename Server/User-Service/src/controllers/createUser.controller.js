import User from '../models/user.model.js';

const createUser = async (req, res) => {
    console.log('Create User controller invoked');
    try {
        const { username, email, devices, authUserId } = req.body;

        //Testing logs
        console.log("username: ",username,"\nEmail: ", email,"\nDevice: ",devices);

        // Check if user with the same email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("User already exists with this email or username:", email, username);
            return res.status(409).json({ message: 'User already exists with this email or username' });
        }

        const newUser = new User({
            username,
            email,
            devices,
            authUserId
        });

        await newUser.save();
        console.log("New user created: ", newUser);
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export default createUser;