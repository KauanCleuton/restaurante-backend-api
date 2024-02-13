import { z } from "zod";

const emailShema = z.string().email()

const validatEmail = (email: string) => {
    try {
        emailShema.parse(email)
        console.log(`${email} é válido`)
        return true
    } catch (error) {
        console.error(`${email} não é um endereço de e-mail válido.`, error);
        return false;
    }
}

export default {
    validatEmail
}