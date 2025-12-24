import axios from "axios";

export const checkServicesHealth = async () => {
    const services = [
        {
            name: "user-service",
            url: process.env.USER_SERVICE_HEALTH_URL
        },
        {
            name: "auth-service",
            url: process.env.AUTH_SERVICE_HEALTH_URL
        }
    ];

    console.log("Running health check...");

    for (const service of services) {
        try {
            const response = await axios.get(service.url);
            console.log(`${service.name} is HEALTHY`, response.data);
        } catch (error) {
            console.error(`${service.name} is UNHEALTHY`);
        }
    }

    console.log("Health check cycle completed\n");
};
