import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map