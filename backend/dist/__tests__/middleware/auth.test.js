import { authenticate } from '../../middleware/auth';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let jsonMock;
    let statusMock;
    const mockPayload = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'user'
    };
    beforeEach(() => {
        mockReq = {
            headers: {}
        };
        jsonMock = jest.fn().mockReturnValue({});
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRes = {
            status: statusMock
        };
        mockNext = jest.fn();
    });
    describe('authenticate middleware', () => {
        it('should call next() with valid bearer token', () => {
            const token = generateAccessToken(mockPayload);
            mockReq.headers = { authorization: `Bearer ${token}` };
            authenticate(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
            expect(mockReq.user?.userId).toBe(mockPayload.userId);
        });
        it('should return 401 when authorization header is missing', () => {
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 when authorization header does not start with Bearer', () => {
            mockReq.headers = { authorization: 'Basic xyz' };
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 for invalid token', () => {
            mockReq.headers = { authorization: 'Bearer invalid.token.here' };
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid or expired token' }));
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 for tampered token', () => {
            const token = generateAccessToken(mockPayload);
            const tamperedToken = token.slice(0, -5) + 'XXXXX';
            mockReq.headers = { authorization: `Bearer ${tamperedToken}` };
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 for refresh token used as access token', () => {
            const refreshToken = generateRefreshToken(mockPayload);
            mockReq.headers = { authorization: `Bearer ${refreshToken}` };
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should set req.user with decoded token payload', () => {
            const token = generateAccessToken(mockPayload);
            mockReq.headers = { authorization: `Bearer ${token}` };
            authenticate(mockReq, mockRes, mockNext);
            expect(mockReq.user).toEqual(expect.objectContaining({
                userId: mockPayload.userId,
                email: mockPayload.email,
                role: mockPayload.role
            }));
        });
        it('should handle empty bearer token', () => {
            mockReq.headers = { authorization: 'Bearer ' };
            authenticate(mockReq, mockRes, mockNext);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.test.js.map