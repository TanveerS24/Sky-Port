import axios from "axios";

const healthCheck = async (req, res) => {
    try {
        const healthCheckServiceUrl = process.env.HEALTH_CHECK_SERVICE_URL + "/health-check";
        const response = await axios.get(healthCheckServiceUrl);
        console.log('Health Check Service Response:', response.data);
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

async function healthCheckLoop() {
    while (true) {
        try {
            await healthCheck();
        } catch (error) {
            console.error("Error during health check loop:", error.message);
        }

        await new Promise(resolve => setTimeout(resolve, 30000));
    }
}

export default healthCheckLoop;