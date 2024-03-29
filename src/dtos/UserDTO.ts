export interface SignupInputDTO {
    nickname: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string
}

export interface UserDecodejwt {
    exp: number,
    iat: number,
    id: string,
    nickname: string,
}
