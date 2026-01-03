import jwt from 'jsonwebtoken';

const verifyAccessToken = (req, res, next) => {
  if(req.path === '/health' || req.path === '/createuser') {
    return next();
  }
  console.log('Verifying access token for path:', req.path);
  const authHeader = req.headers['authorization'];

  if(!authHeader) {
    console.log('No access token provided in request headers');
    return res.status(401).json({ message: 'Couldnt find access token' });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

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