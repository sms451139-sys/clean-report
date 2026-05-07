export declare class AuthService {
    register(email: string, password: string, name: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        };
    }>;
    verifyRefreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map