import UserFiles from "../models/files.model.js";

const validateAccess = async (req, res, next) => {
    try {
        const { ownerId, fileId } = req.params;
        const userId = req.user.id;

        const userFiles = await UserFiles.findOne({ ownerId });
        if (!userFiles) {
            return res.status(404).json({ message: "Files not found" });
        }

        const file = userFiles.files.find(f => f.fileId === fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const expiryTime = file.expiry?.get(userId.toString());

        if (expiryTime && new Date() > expiryTime) {
            file.sharedWith = file.sharedWith.filter(
                id => id.toString() !== userId.toString()
            );

            file.expiry.delete(userId.toString());
            await userFiles.save();

            return res.status(403).json({ message: "Access expired" });
        }

        if (!file.sharedWith.includes(userId)) {
            return res.status(403).json({ message: "No access" });
        }

        next();

    } catch (err) {
        console.error("Access validation error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export default validateAccess;
