import User, { IUser } from "../models/user.model"
import bcrypt from "bcrypt"
import { userService } from "./user.service"
import env from '../config/environments'
import jwt from 'jsonwebtoken'

interface IAuthenticationToken {
    token: string
    username: string
    id: string
}

const generateToken = (user: IUser): string => {
    return jwt.sign({ username: user.username }, env.appSecret)
}

const login = async (username: string, password: string): Promise<IAuthenticationToken> => {
    return User.findOne({ username: username }).then((user) => {
        if (!user) {
            throw('ERROR_AUTH_1:username is not correct')
        }
        return bcrypt.compare(password, user.toObject().password).then((result) => {
            if (result) {
                return <IAuthenticationToken> {
                    token: generateToken(user.toObject() as IUser),
                    username: user.toObject().username,
                    id: user.toObject()._id,
                }
            } else {
                throw('ERROR_AUTH_2:password is not correct')
            }
        }).catch((err) => {
            throw(err)
        })
    })
}

const register = async (username: string, password: string): Promise<IAuthenticationToken> => {
    const saltRounds = 10
    await userService.hasUsername(username).then((hasUsername) => {
        if (hasUsername) {
            throw('ERROR_AUTH_3:username already existed')
        }
    })
    return bcrypt.hash(password, saltRounds).then((hash) => {
        const newUser = new User({
            username: username,
            password: hash,
            has_profile: false,
        })
        return newUser.save().then((_) => {
            return login(username, password)
        })
    })
}

export const authenticationService = {
    login,
    register,
}