import jwt from 'jsonwebtoken';

const verifyAccessToken = (req, res, next) => {
  console.log('Verifying access token for path:', req.path);
    if(req.path === '/health' || req.path === '/createuser') {
        return next();
    }
  const token = req.headers['authorization'];

  if(!token) {
    console.log('No access token provided in request headers');
    return res.status(401).json({ message: 'Couldnt find access token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log('Access token verified for user:', decoded.id);
    next();
  } catch (error) {
    console.log('Invalid or expired access token:', error.message);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }

};

export default verifyAccessToken;