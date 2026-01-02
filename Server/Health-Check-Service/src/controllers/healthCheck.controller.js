import axios from "axios";

const checkServicesHealth = async (req, res) => {
    const url = process.env.API_GATEWAY_URL;
    if (!url) {
        console.error("API_GATEWAY_URL is not configured");
        if (res) return res.status(500).json({ message: "API_GATEWAY_URL is not configured" });
        throw new Error("API_GATEWAY_URL is not configured");
    }

    const services = [
        { name: "User Service", url: `${url}/api/user/health` },
        { name: "Auth Service", url: `${url}/api/auth/health` },
        { name: "File Service", url: `${url}/api/files/health` }
    ];

    for (const service of services) {
        try {
            console.log(`Checking health of ${service.name} at ${service.url}`);
            const response = await axios.get(service.url, { timeout: 5000 });
            console.log('Response Body:', response.data);
        } catch (error) {
            if (error.response) {
                console.error(`Health check failed for ${service.name}:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.error(`Health check failed for ${service.name}:`, error.request);
            } else {
                console.error(`Health check failed for ${service.name}:`, error.message);
            }
        }
    }

    return res.status(200).json({ message: "Health check completed" });
};

export default checkServicesHealth;
