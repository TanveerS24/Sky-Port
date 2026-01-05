import UserFiles from '../models/files.model.js';

const retrieveFiles = async (req, res) => {
    console.log("Retrieve Files endpoint Invoked");
    try {
        const { ownerId } = req.query;
        if (!ownerId) {
            console.log("ownerId missing in query parameters");
            return res.status(400).json({ message: "ownerId is required" });
        }
        const userFiles = await UserFiles.findOne({ ownerId });
        if (!userFiles) {
            console.log(`No files found for ownerId: ${ownerId}`);
            return res.status(404).json({ message: "No files found for the specified ownerId" });
        }
        console.log(`Files retrieved for ownerId: ${ownerId}`);
        res.status(200).json(userFiles.files);
    } catch (err) {
        console.error("Error retrieving files:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default retrieveFiles;