import cloudinary from "../config/cloudinary.config.js";
import UserFiles from "../models/files.model.js";

const deleteFile = async (req, res) => {
    console.log("Delete File endpoint Invoked");
    
    try {
        const { fileId, ownerId } = req.body;
        
        if (!fileId || !ownerId) {
            console.log("fileId or ownerId missing");
            return res.status(400).json({ message: "fileId and ownerId are required" });
        }

        // Find the user's files document and the specific file
        const userFiles = await UserFiles.findOne({ ownerId });
        
        if (!userFiles) {
            console.log("User files not found");
            return res.status(404).json({ message: "User files not found" });
        }

        // Find the file to delete
        const fileToDelete = userFiles.files.find(file => file.fileId === fileId);
        
        if (!fileToDelete) {
            console.log("File not found");
            return res.status(404).json({ message: "File not found" });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(fileToDelete.cloudinary.publicId);
            console.log("File deleted from Cloudinary:", fileToDelete.cloudinary.publicId);
        } catch (cloudinaryErr) {
            console.error("Error deleting from Cloudinary:", cloudinaryErr);
            // Continue with DB deletion even if Cloudinary fails
        }

        // Remove file from database
        await UserFiles.findOneAndUpdate(
            { ownerId },
            { $pull: { files: { fileId: fileId } } }
        );

        console.log("File deleted successfully from DB");
        
        res.status(200).json({
            message: "File deleted successfully",
            fileId: fileId,
            fileName: fileToDelete.fileName
        });
        
    } catch (err) {
        console.error("Delete failed:", err);
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

export default deleteFile;
