import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database';

dotenv.config();

interface IToken {
    id: string,
    email: string,
}
export interface CustomRequest extends Request {
    user?: any; // ou substitua 'any' pelo tipo correto se souber o tipo exato
}


class JWTToken {
    verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
        const jwtSecret = process.env.JWT_SECRET;
        const auth = req.headers.authorization || req.headers.Authorization;

        if (!auth) {
            return res.status(401).json({ error: 'No token provided' });
        }
        if (typeof auth !== 'string') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const token = auth.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        jwt.verify(token, jwtSecret as Secret, (err: any, decoded: any) => {
            if (err) {
                console.error("Erro ao verificar o token:", err);
                return res.status(401).json({ error: 'Failed to authenticate token' });
            }
            req.user = decoded
            next()
        });
    }
    createAccessToken(payload: IToken) {
        if (payload) {
            console.log('payload token', payload)
            const secret = process.env.JWT_SECRET
            if (!secret) {
                return false
            }
            const token = jwt.sign({ data: payload }, secret, {
                subject: payload.id,
                expiresIn: process.env.JWT_ACCESS
            })
            return token
        }
        return null
    }
    createRefreshToken(payload: IToken) {
        if (payload) {
            console.log('payload refreshToken', payload)
            const secret = process.env.JWT_SECRET
            if (!secret) {
                return false
            }
            const refreshToken = jwt.sign({ data: payload }, secret, {
                subject: payload.id,
                expiresIn: process.env.JWT_REFRESH
            })
            return refreshToken
        }
        return null
    }
    verifyAdmin(req: CustomRequest, res: Response, next: NextFunction) {
        if (req.user?.data.role === "admin") {
            next()
        }
        else {
            return res.status(403).json({ message: 'Acesso negado para usuários' })
        }
    }
    async verifyLogged(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const logged = await prisma.user.findUnique({
                where: {
                    id: req.user?.data.id
                }
            })
            if (!logged?.logged) {
                return res.status(403).json({ message: 'Faça login primeiro!' })
            }
            next()
        } catch (error) {
            console.error("Erro ao atualizar o status de log do usuário:", error);
        }
    }
}

export default new JWTToken;
