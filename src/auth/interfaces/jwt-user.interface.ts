export interface JwtUser {
    sub: number;
    name: string;
    email: string;
    roles: string[];
}