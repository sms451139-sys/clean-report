export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload | null;
export declare const verifyRefreshToken: (token: string) => JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map