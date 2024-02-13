import { Request, Response } from 'express';
import userModel from "../models/auth.model";
import { IToken, IUser } from '../types/user.type';

import validatEmail from '../utils/validatEmail';
import auth, { CustomRequest } from '../middleware/auth';
import authModel from '../models/auth.model';

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(409).json({ message: 'Campos Inválidos!' });
        }
        const emailValidate = validatEmail.validatEmail(email)

        if (!emailValidate) {
            return res.status(400).json({ message: 'Email inválido!' })
        }

        const data: IUser = {
            email: email,
            name: name,
            password: password
        };

        const registerUser = await userModel.register(data);
        return res.status(201).json({ message: 'Usuário registrado!', user: registerUser });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(401).json({ message: 'Campos obrigatórios' })
        const body = {
            email: email,
            password: password
        }
        const emailValidate = validatEmail.validatEmail(email)
        if (!emailValidate) {
            return res.status(400).json({ message: 'Email inválido!' });
        }

        const user = await userModel.login(body)
        const tokenPayLoad: IToken = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        const accessToken = auth.createAccessToken(tokenPayLoad)
        const refreshToken = auth.createRefreshToken(tokenPayLoad)
        const response = {
            auth: user.logged,
            email: user.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: `Usuário logado com: ${user.email}`,
            user: user
        }
        console.log(response)
        return res.status(200).json({ response: response })

    } catch (error) {
        console.error("Error login user:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const newAccessToken = async (req: CustomRequest, res: Response) => {
    try {
        const data = req.user?.data;

        if (!data) {
            return res.status(400).json({ message: 'token não fornecido' });
        }

        const accessToken = auth.createAccessToken(data);

        if (!accessToken) {
            return res.status(500).json({ message: 'Erro ao criar o AccessToken' });
        }

        res.json({ accessToken });
    } catch (error) {
        console.error("Erro ao criar o AccessToken:", error);
        res.status(500).json({ message: 'Erro ao criar o AccessToken' });
    }
};

const logout = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user.data.id
        if(!userId) {
            return res.status(409).json({message: 'Id do usuário inválido!'})
        }
        const logoutUser = await authModel.logoutUser(userId)

        return res.status(200).json({message: 'Usuário deslogado!', logout: logoutUser})
    } catch (error) {
        console.error("Erro ao criar o AccessToken:", error);
        res.status(500).json({ message: 'Erro ao criar o AccessToken' });
    }
}



export default {
    registerUser,
    login,
    newAccessToken,
    logout
};
