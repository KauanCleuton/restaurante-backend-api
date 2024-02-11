import { Request, Response } from 'express';
import userModel from "../models/user.model";
import criptoPassoword from '../utils/criptoPassoword';
import IUser from '../types/user.type';

const listUser = async (req: Request, res: Response) => {
    const users = await userModel.listUsers();

    if (users.length === 0) {
        return res.status(200).json({ users: users });
    }

    console.table(users);
    return res.status(200).json({ users: users });
};

const registerUser = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(409).json({ message: 'Campos Inválidos!' });
    }

    const hashPassword = await criptoPassoword.hashPassword(password);

    const data: IUser = {
        email: email,
        name: name,
        password: hashPassword
    };

    const registerUser = userModel.register(data);
    return res.status(201).json({ message: 'Usuário registrado!', user: registerUser });
};

export default {
    listUser,
    registerUser
};
