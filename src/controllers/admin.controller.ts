import { Request, Response } from 'express';
import { IProducts, IUser } from '../types/types';

import validatEmail from '../utils/validatEmail';
import adminModel from '../models/admin.model';
import { Prisma } from '@prisma/client';


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

const createMenu = async (req: Request, res: Response) => {
    const { name, photo, category, description, price }: IProducts = req.body
    try {

        if (!name || !photo || !category || !description || !price) {
            return res.status(409).json({ message: 'Campos Inválidos' })
        }
        const data = {
            name,
            photo,
            category,
            description,
            price: price
        }
        const products = adminModel.createMenu(data)
        return res.status(201).json({ message: 'Item adicionado ao menu!', menu: products })

    } catch (error) {
        console.error("Error add menu:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const allProductsMenu = async (req: Request, res: Response) => {
    try {
        const products = await adminModel.allProductsMenu()

        if (!products) {
            return res.status(409).json({ message: 'Não existe nenhum item no menu!' })
        }
        console.log(products, 'Kauan Cleuton da Silvaaaaaaaaaaaaaaaaa')
        return res.status(200).json({ menu: products })
    } catch (error) {
        console.error("Error add menu:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
const editProductsMenu = async (req: Request, res: Response) => {
    const data = req.body;
    const id = Number(req.params.id);

    try {
        if (!data) {
            return res.status(409).json({ message: 'Não existem valores!' });
        }

        const edit = await adminModel.editProductsMenu(id, data);
        console.log(edit);

        if (!edit) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }

        return res.status(200).json({ message: 'Produto editado com sucesso!', item: edit });
    } catch (error) {
        console.error('Erro ao editar produtos', error);
        return res.status(500).json({ message: 'Server Internal Error' });
    }
};

const deleteProductsMenu = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
        const deleteItem = await adminModel.deleteProductsItem(id)
        if (!deleteItem) {
            return res.status(400).json({message: 'Erro ao deletar item!'})
        }
        return res.status(200).json({message: `Item da posição ${id} deletado com sucesso!`})
    } catch (error) {
        console.error('Erro ao deletar item do menu', error)
        return res.status(500).json({ message: 'Server Internal Error' })
    }
}

const rotaPrivada = (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Rota privada' })
}

export default {
    listUser,
    rotaPrivada,
    createAdmin,
    createMenu,
    allProductsMenu,
    editProductsMenu,
    deleteProductsMenu
};
