const healthCheck = (req, res) => {
  res.json({
    service: "User Service",
    baseUrl: process.env.BASE_URL,
    status: "running"
  });
};

export default healthCheck;