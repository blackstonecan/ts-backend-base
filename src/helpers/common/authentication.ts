import jwt from 'jsonwebtoken';

import { ITokenPayload } from '../../interfaces/Common';
import Response from '../response/Response';
import { hashPassword } from './crypt';

const oneHour = 1 * 60 * 60;

const generateToken = async (email: string, key: string) : Promise<Response> => {
    try {
        const hashed = await hashPassword(key);

        const now = Math.floor(Date.now() / 1000);
        const expireTime = now + oneHour;

        const tokenPayload: ITokenPayload = {
            email: email,
            iat: now,
            exp: expireTime,
            key: hashed
        };

        const APP_SECRET_KEY = process.env.APP_SECRET_KEY;
        if (!APP_SECRET_KEY) return Response.getMessageError("Server error");

        const token = jwt.sign(tokenPayload, APP_SECRET_KEY);

        return Response.getSuccess(token);
    } catch (error: any) {
        return Response.getError(error);
    }
}

export {
    generateToken
}