import crypto from "crypto";

const algorithm = "aes-256-cbc";

const getSecretKey = () => {
    if (!process.env.ENCRYPTION_SECRET) {
        throw new Error("ENCRYPTION_SECRET missing");
    }

    return crypto.createHash("sha256")
        .update(process.env.ENCRYPTION_SECRET)
        .digest();
};

// 🔐 Encrypt (for storage)
export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, getSecretKey(), iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
};

// 🔓 Decrypt (for response)
export const decrypt = (data) => {
    const [ivHex, encrypted] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, getSecretKey(), iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

// 🔍 Hash (for search)
export const hashForSearch = (text) => {
    return crypto.createHash("sha256").update(text).digest("hex");
};