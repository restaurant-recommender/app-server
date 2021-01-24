import { Request, Response } from 'express'
import { authenticationService } from '../services'
import { errorResponse, successResponse } from '../utilities/controller'

interface RegisterRequestBody {
    username: string
    password: string
}

interface LoginRequestBody {
    username: string
    password: string
}

export const authenticationController = {
    login: (req: Request, res: Response): void => {
        const body: LoginRequestBody = req.body
        authenticationService.login(body.username, body.password).then((token) => {
            res.json(successResponse(token))
        }).catch((error) => { res.json(errorResponse(error)) })
    },

    register: (req: Request, res: Response): void => {
        const body: RegisterRequestBody = req.body
        authenticationService.register(body.username, body.password).then((token) => {
            res.json(successResponse(token))
        }).catch((error) => { res.json(errorResponse(error)) })
    },
}