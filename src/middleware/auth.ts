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
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) return false
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) return res.status(500).json({ message: 'Chave secreta não definida' });

            const decoded = jwt.verify(accessToken, secret) as unknown as { data: IToken, type: string } | null;
            if (!decoded || decoded.type !== 'access') {
                return res.status(401).json({ message: 'AccessToken inválido' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'AccessToken inválido' });
        }
    }
    // createAccessToken(payload: IToken) {
    //     if (payload) {
    //         console.log('payload token', payload)
    //         const secret = process.env.JWT_SECRET
    //         if (!secret) {
    //             return false
    //         }
    //         const token = jwt.sign({ data: payload }, secret, {
    //             subject: payload.id,
    //             expiresIn: process.env.JWT_ACCESS
    //         })
    //         return token
    //     }
    //     return null
    // }
    createAccessToken(payload: IToken, refresh = 0 || false) {
        if (!payload) return false;
        const secret = process.env.JWT_SECRET
        if (!secret) {
            return false
        }
        return jwt.sign({ data: payload, type: refresh ? 'refresh' : 'access' }, secret, {
            expiresIn: refresh
                ? process.env.JWT_REFRESH
                : process.env.JWT_ACCESS,
        });
    };

    refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;
        const auth = new JWTToken()
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) return res.status(500).json({ message: 'Chave secreta não definida' });

            const decoded = jwt.verify(refreshToken, secret) as { data: IToken, type: string } | null;
            if (!decoded || decoded.type !== 'refresh') {
                return res.status(401).json({ message: 'Refresh token inválido' });
            }

            console.log(decoded.data, 'Kaaudansdnasdnsndasndnas 88888888888')
            const accessToken = auth.createAccessToken(decoded.data)
            console.log('data', decoded.data);
            console.log('NRT', accessToken);

            res.json({ accessToken });
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Refresh token inválido' });
        }
    };

    createRefreshToken(payload: IToken) {
        return this.createAccessToken(payload, true);
    };

    verifyAdmin(req: CustomRequest, res: Response, next: NextFunction) {
        if (req.user?.data.role === "admin") {
            next()
        }
        else {
            return res.status(403).json({ message: 'Acesso Negado! Você não é um administrador!' })
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
