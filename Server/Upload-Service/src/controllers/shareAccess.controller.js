import UserFiles from "../models/files.model.js";

const shareAccess = async (req, res) => {
    console.log("Share Access endpoint invoked");

    try {
        const { ownerId, fileId, targetUserId, expiryInHours } = req.body;

        if (!ownerId || !fileId || !targetUserId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const userFiles = await UserFiles.findOne({ ownerId });
        if (!userFiles) {
            return res.status(404).json({ message: "Owner files not found" });
        }

        const file = userFiles.files.find(f => f.fileId === fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.sharedWith.includes(targetUserId)) {
            return res.status(409).json({ message: "User already has access" });
        }

        file.sharedWith.push(targetUserId);

        let expiryDate = null;

        if (expiryInHours) {
            expiryDate = new Date(
                Date.now() + expiryInHours * 60 * 60 * 1000
            );

            file.expiry.set(targetUserId.toString(), expiryDate);
        }

        await userFiles.save();

        console.log("Access given to user:", targetUserId);
        return res.status(200).json({
            message: "Access granted successfully",
            expiresAt: expiryDate
        });

    } catch (error) {
        console.error("Error giving access:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default shareAccess;
