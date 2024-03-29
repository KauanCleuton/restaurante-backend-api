import prisma from "../config/database";
import { IUser } from "../types/user.type";
import criptoPassoword from "../utils/criptoPassoword";

interface ILogin {
    email: string,
    password: string
}

const listUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


const register = async (data: IUser) => {
    try {
        const hashPassword = await criptoPassoword.hashPassword(data.password);
        const registerUser = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashPassword,
                created_at: new Date()
            }
        });
        return registerUser;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const login = async (data: ILogin) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: data.email
            }
        });

        if (users.length === 0) {
            throw new Error("User not exists!");
        }

        const compare = await criptoPassoword.comparePassowrd(data.password, users[0].password);
        if (!compare) {
            throw new Error('Incorrect password!');
        }

        const updatedUser = await prisma.user.update({
            where: {
                email: users[0].email
            },
            data: {
                logged: true
            }
        });

        return updatedUser;
    } catch (error) {
        console.error("Error login user:", error);
        throw error;
    }
};

export default {
    register,
    listUsers,
    login
};
