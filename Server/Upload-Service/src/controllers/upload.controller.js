import cloudinary from "../config/cloudinary.config.js";
import UserFiles from "../models/files.model.js";

const uploadFile = async (req, res) => {
    console.log("Upload File endpoint Invoked");
    let cloudinaryResult = null;
    
    try {
        const { folder, ownerId } = req.body;
        
        if (!req.file || !folder || !ownerId) {
            console.log("File, folder, or ownerId missing");
            return res.status(400).json({ message: "File, folder, and ownerId are required" });
        } 

        // Upload to Cloudinary first
        cloudinaryResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder,
                    resource_type: 'auto', // Automatically detect image, video, or raw file
                    chunk_size: 6000000 // 6MB chunks for large files
                },
                (err, result) => (err ? reject(err) : resolve(result))
            ).end(req.file.buffer);
        });

        console.log("Cloudinary upload successful:");

        // Create file object
        const fileData = {
            fileId: crypto.randomUUID(),
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            folder: folder,
            cloudinary: {
                publicId: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url
            },
            sharedWith: [],
            createdAt: new Date()
        };

        // Update or create user files document
        const userFiles = await UserFiles.findOneAndUpdate(
            { ownerId },
            { $push: { files: fileData } },
            { upsert: true, new: true }
        );

        console.log("Database save successful");
        
        res.status(201).json({
            fileId: fileData.fileId,
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.secure_url,
            folder,
            fileName: req.file.originalname
        });
    } catch (err) {
        console.error("Upload failed:", err);
        
        // Rollback: Delete from Cloudinary if DB save failed
        if (cloudinaryResult && cloudinaryResult.public_id) {
            try {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                console.log("Cloudinary rollback successful:", cloudinaryResult.public_id);
            } catch (deleteErr) {
                console.error("Cloudinary rollback failed:", deleteErr);
            }
        }
        
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};

export default uploadFile;