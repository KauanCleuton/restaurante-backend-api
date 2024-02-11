import prisma from "../config/database";
import IUser from "../types/user.type";

const listUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const register = async (data: IUser) => {
    const registerUser = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: data.password,
            created_at: new Date()
        }
    });
    return registerUser;
};

export default {
    register,
    listUsers
};
