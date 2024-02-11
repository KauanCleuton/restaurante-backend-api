import bcrypt from 'bcrypt'

const hashPassword = async (password: string) => {
    const saltRouds = 10
    return await bcrypt.hash(password, saltRouds)
}
const comparePassowrd = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}


export default {
    hashPassword,
    comparePassowrd
}