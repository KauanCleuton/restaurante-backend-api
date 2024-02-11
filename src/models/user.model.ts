import prisma from "../config/database";
import IUser from "../types/user.type";


const listUsers = async () => {
    try {
        const users = await prisma.user.findMany()
        return users
    } catch (error) {
        console.log('Server internal error!', error)
        throw new Error('Server internal error')
    }
}
const register = async (data: IUser) => {
    try {
        const registerUser = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                created_at: new Date()
            }
        })
        return registerUser
    } catch (error) {
        console.log('Server internal error!', error)
        throw new Error('Server internal error')
    }
}

export default {
    register,
    listUsers
}