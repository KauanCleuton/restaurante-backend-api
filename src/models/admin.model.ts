import { UUID } from "typeorm/driver/mongodb/bson.typings";
import prisma from "../config/database";
import { IProducts, IUser } from "../types/types";
import criptoPassoword from "../utils/criptoPassoword";


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
            data: {
                ...data,
            }
        })

        console.log(products)
        return products

    } catch (error) {
        console.error("Error create menu:", error);
        throw error;
    }
}

export default {
    listUsers,
    createAdmin,
    createMenu
};
