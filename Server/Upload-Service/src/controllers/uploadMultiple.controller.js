import cloudinary from "../config/cloudinary.config.js";
import UserFiles from "../models/files.model.js";
import crypto from "crypto";

const uploadMultipleFiles = async (req, res) => {
    console.log("Upload Multiple Files endpoint Invoked");
    const uploadedFiles = [];
    const failedFiles = [];
    
    try {
        const { folder, ownerId } = req.body;
        
        if (!req.files || req.files.length === 0) {
            console.log("No files provided");
            return res.status(400).json({ message: "At least one file is required" });
        }

        if (!folder || !ownerId) {
            console.log("Folder or ownerId missing");
            return res.status(400).json({ message: "Folder and ownerId are required" });
        }

        // Upload files one by one
        for (const file of req.files) {
            let cloudinaryResult = null;
            
            try {
                // Upload to Cloudinary
                cloudinaryResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder },
                        (err, result) => (err ? reject(err) : resolve(result))
                    ).end(file.buffer);
                });

                console.log(`Cloudinary upload successful for: ${file.originalname}`);

                // Create file object
                const fileData = {
                    fileId: crypto.randomUUID(),
                    fileName: file.originalname,
                    mimeType: file.mimetype,
                    folder: folder,
                    cloudinary: {
                        publicId: cloudinaryResult.public_id,
                        url: cloudinaryResult.secure_url
                    },
                    sharedWith: [],
                    createdAt: new Date()
                };

                // Update or create user files document
                await UserFiles.findOneAndUpdate(
                    { ownerId },
                    { $push: { files: fileData } },
                    { upsert: true, new: true }
                );

                uploadedFiles.push({
                    fileId: fileData.fileId,
                    fileName: file.originalname,
                    url: cloudinaryResult.secure_url,
                    publicId: cloudinaryResult.public_id
                });

                console.log(`Database save successful for: ${file.originalname}`);
                
            } catch (fileErr) {
                console.error(`Failed to upload ${file.originalname}:`, fileErr);
                
                // Rollback: Delete from Cloudinary if DB save failed
                if (cloudinaryResult && cloudinaryResult.public_id) {
                    try {
                        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                        console.log("Cloudinary rollback successful:", cloudinaryResult.public_id);
                    } catch (deleteErr) {
                        console.error("Cloudinary rollback failed:", deleteErr);
                    }
                }
                
                failedFiles.push({
                    fileName: file.originalname,
                    error: fileErr.message
                });
            }
        }

        // Return response with results
        res.status(uploadedFiles.length > 0 ? 201 : 500).json({
            message: `Uploaded ${uploadedFiles.length} of ${req.files.length} files`,
            uploaded: uploadedFiles,
            failed: failedFiles,
            folder
        });
        
    } catch (err) {
        console.error("Multiple upload failed:", err);
        res.status(500).json({ 
            message: "Upload failed", 
            error: err.message,
            uploaded: uploadedFiles,
            failed: failedFiles
        });
    }
};

export default uploadMultipleFiles;
