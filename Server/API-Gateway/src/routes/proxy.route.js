import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

import verifyAccessToken from '../middlewares/verifyAccessToken.middleware.js';
import {authRateLimiter, apiRateLimiter} from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API Gateway is running');
});

router.use('/user',
    apiRateLimiter, 
    verifyAccessToken,
    createProxyMiddleware({
        changeOrigin: true,
        selfHandleResponse: false,
        router: (req) => {
            if (!process.env.USER_SERVICE_URL) {
                throw new Error('USER_SERVICE_URL is not defined in environment variables');
            }
            return process.env.USER_SERVICE_URL;
        },
        onProxyReq: (proxyReq, req) => {
            if(req.body && Object.keys(req.body).length > 0){
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onProxyReqEnd: (proxyReq, req) => {
            proxyReq.end();
        }
    })
);

router.use('/auth', 
    authRateLimiter,
    createProxyMiddleware({
        changeOrigin: true,
        selfHandleResponse: false,
        logLevel: 'debug',
        router: (req) => {
            if (!process.env.AUTH_SERVICE_URL) {
                throw new Error('AUTH_SERVICE_URL is not defined in environment variables');
            }
            console.log('Routing to:', process.env.AUTH_SERVICE_URL);
            return process.env.AUTH_SERVICE_URL;
        },
        onProxyReq: (proxyReq, req) => {
            console.log('Proxying request to Auth Service:', req.method, req.url);
            console.log('Request body:', req.body);
            if(req.body && Object.keys(req.body).length > 0){
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onProxyReqEnd: (proxyReq, req) => {
            proxyReq.end();
        }
    })
);

export default router;
