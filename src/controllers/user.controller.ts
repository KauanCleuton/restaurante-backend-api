import { Request, Response } from 'express';
import userModel from "../models/user.model";
import { IToken, IUser } from '../types/user.type';
import auth, { CustomRequest } from '../utils/auth';
import validatEmail from '../utils/validatEmail';
import jwt from 'jsonwebtoken'


const listUser = async (req: Request, res: Response) => {
    try {
        const users = await userModel.listUsers();

        if (users.length === 0) {
            return res.status(200).json({ users: users });
        }

        console.table(users);
        return res.status(200).json({ users: users });
    } catch (error) {
        console.error("Error listing users:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

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




const rotaPrivada = (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Rota privada' })
}

export default {
    listUser,
    registerUser,
    login,
    rotaPrivada,
    newAccessToken
};
