import { Request, Response } from 'express';
import { IUser } from '../types/user.type';

import validatEmail from '../utils/validatEmail';
import adminModel from '../models/admin.model';


const listUser = async (req: Request, res: Response) => {
    try {
        const users = await adminModel.listUsers();

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

const createAdmin = async (req: Request, res: Response) => {
    const { email, name, password } = req.body
    try {
        if (!email || !name || !password) {
            return res.status(409).json({ message: 'Campos Inválidos' })
        }
        const emailValidate = validatEmail.validatEmail(email)

        if (!emailValidate) {
            return res.status(400).json({ message: 'Email inválido' })
        }
        const data: IUser = {
            email: email,
            name: name,
            password: password
        }

        const registerAdmin = await adminModel.createAdmin(data)
        console.log(registerAdmin)
        return res.status(201).json({ message: 'Novo administrador criado!', admin: registerAdmin })
    } catch (error) {
        console.error("Error add admin:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}







const rotaPrivada = (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Rota privada' })
}

export default {
    listUser,
    rotaPrivada,
    createAdmin
};
