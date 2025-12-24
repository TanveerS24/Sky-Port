import User from "../models/user.model.js";

const editUser = async (req, res) => {
    console.log("Edit User controller invoked");
    try {
        const id = req.params.id;
        const updates = req.body;

        console.log("Updates received: ", updates);

        const allowedEdits = ['username', 'email'];

        Object.keys(updates).forEach((key) => {
            if (!allowedEdits.includes(key)) {
                delete updates[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(id, updates,{$set: updates}, { new: true, runValidators: true });

        if(!updatedUser){
            console.log("User doesn't Exist");
            res.status(404).json({message:"User doesn't Exist"});
        }

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error("Error updating user: ", error);
        return res.status(422).json({ message: 'Error updating user', error: error.message });
    }
};

export default editUser;