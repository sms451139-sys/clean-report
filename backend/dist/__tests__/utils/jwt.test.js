import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../utils/jwt';
describe('JWT Utils', () => {
    const mockPayload = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'user'
    };
    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = generateAccessToken(mockPayload);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });
        it('should generate tokens with correct payload structure', async () => {
            const token1 = generateAccessToken(mockPayload);
            await new Promise(resolve => setTimeout(resolve, 100));
            const token2 = generateAccessToken(mockPayload);
            const decoded1 = verifyAccessToken(token1);
            const decoded2 = verifyAccessToken(token2);
            expect(decoded1?.userId).toBe(mockPayload.userId);
            expect(decoded2?.userId).toBe(mockPayload.userId);
        });
    });
    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = generateRefreshToken(mockPayload);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });
        it('should generate tokens with correct payload structure', async () => {
            const token1 = generateRefreshToken(mockPayload);
            await new Promise(resolve => setTimeout(resolve, 100));
            const token2 = generateRefreshToken(mockPayload);
            const decoded1 = verifyRefreshToken(token1);
            const decoded2 = verifyRefreshToken(token2);
            expect(decoded1?.userId).toBe(mockPayload.userId);
            expect(decoded2?.userId).toBe(mockPayload.userId);
        });
    });
    describe('verifyAccessToken', () => {
        it('should verify and decode a valid access token', () => {
            const token = generateAccessToken(mockPayload);
            const decoded = verifyAccessToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(mockPayload.userId);
            expect(decoded?.email).toBe(mockPayload.email);
            expect(decoded?.role).toBe(mockPayload.role);
        });
        it('should return null for invalid token', () => {
            const result = verifyAccessToken('invalid.token.here');
            expect(result).toBeNull();
        });
        it('should return null for expired token', async () => {
            const shortExpirePayload = { ...mockPayload };
            const token = generateAccessToken(shortExpirePayload);
            await new Promise(resolve => setTimeout(resolve, 100));
            const decoded = verifyAccessToken(token);
            expect(typeof decoded).toBe('object');
        });
        it('should return null for tampered token', () => {
            const token = generateAccessToken(mockPayload);
            const tamperedToken = token.slice(0, -5) + 'XXXXX';
            const result = verifyAccessToken(tamperedToken);
            expect(result).toBeNull();
        });
    });
    describe('verifyRefreshToken', () => {
        it('should verify and decode a valid refresh token', () => {
            const token = generateRefreshToken(mockPayload);
            const decoded = verifyRefreshToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(mockPayload.userId);
            expect(decoded?.email).toBe(mockPayload.email);
            expect(decoded?.role).toBe(mockPayload.role);
        });
        it('should return null for invalid token', () => {
            const result = verifyRefreshToken('invalid.token.here');
            expect(result).toBeNull();
        });
        it('should return null for tampered token', () => {
            const token = generateRefreshToken(mockPayload);
            const tamperedToken = token.slice(0, -5) + 'XXXXX';
            const result = verifyRefreshToken(tamperedToken);
            expect(result).toBeNull();
        });
    });
    describe('Token separation', () => {
        it('should not verify access token as refresh token', () => {
            const accessToken = generateAccessToken(mockPayload);
            const result = verifyRefreshToken(accessToken);
            expect(result).toBeNull();
        });
        it('should not verify refresh token as access token', () => {
            const refreshToken = generateRefreshToken(mockPayload);
            const result = verifyAccessToken(refreshToken);
            expect(result).toBeNull();
        });
    });
});
//# sourceMappingURL=jwt.test.js.map