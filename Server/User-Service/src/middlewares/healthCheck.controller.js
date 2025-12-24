const healthCheck = (req, res) => {
    console.log('Health check endpoint invoked');
    return res.status(200).json({
        service: "User Service",
        baseUrl: process.env.BASE_URL,
        status: "running"
    });
};

export default healthCheck;