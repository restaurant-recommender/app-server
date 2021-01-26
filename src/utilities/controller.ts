export interface Response {
    status: boolean
}

export interface SuccessResponse extends Response {
    data?: any
}

export interface ErrorResponse extends Response {
    code: string
    message: string
}

export const errorResponse = (error: any): ErrorResponse => {
    const [code, message] = error.message?.includes(':') ? error.message.split(':') : error.message ? ['unknown', error.message] : ['unknown', error as string]
    return {
        status: false,
        code,
        message,
    }
}

export const successResponse = (data: any): SuccessResponse => {
    return {
        status: true,
        data,
    }
}