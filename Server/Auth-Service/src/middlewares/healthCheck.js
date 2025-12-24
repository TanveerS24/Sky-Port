const healthCheck = (req, res) => {
    res.json({
        service: "Auth Service",
        baseUrl: process.env.BASE_URL,
        status: "running"
    });
};

export default healthCheck;