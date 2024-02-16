import { UUID } from "typeorm/driver/mongodb/bson.typings";
import prisma from "../config/database";
import { IProducts, IUser } from "../types/types";
import criptoPassoword from "../utils/criptoPassoword";
import { Prisma } from "@prisma/client";


const listUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
const createAdmin = async (data: IUser) => {
    try {
        const hashPassword = await criptoPassoword.hashPassword(data.password)
        const admin = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashPassword,
                role: "admin",
                created_at: new Date(),
            }
        })
        return admin
    } catch (error) {
        console.error("Error add admin:", error);
        throw error;
    }
}

const createMenu = async (data: IProducts) => {
    try {
        const products = await prisma.products.create({
            data: data
        })
        console.log(products)
        return products

    } catch (error) {
        console.error("Error create menu:", error);
        throw error;
    }
}

const allProductsMenu = async () => {
    try {
        const products = await prisma.products.findMany()
        console.table(products)
        return products
    } catch (error) {
        console.error("Error list all menu:", error);
        throw error;
    }
}

const editProductsMenu = async (id: number, data: { name?: string, photo?: string, description?: string, price?: number, category?: string }) => {
    try {
        const edit = await prisma.products.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        });
        console.log(edit);
        return edit;
    } catch (error) {
        console.error("Erro ao editar item do menu:", error);
        throw error;
    }
}

const deleteProductsItem = async (id: number) => {
    try {
        const deleteItem = await prisma.products.delete({
            where: {
                id: id
            }
        })
        console.log('Item deletado!', deleteItem)
        return deleteItem
    } catch (error) {
        console.error("Erro ao deletar item do menu:", error);
        throw error;
    }
}

export default {
    listUsers,
    createAdmin,
    createMenu,
    allProductsMenu,
    editProductsMenu,
    deleteProductsItem
};
