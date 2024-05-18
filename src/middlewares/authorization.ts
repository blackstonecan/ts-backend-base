import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

import CustomRequest from "../helpers/response/CustomRequest";
import CustomError from "../helpers/error/CustomError";

import { ITokenPayload } from "../interfaces/Common";

import { generateToken } from "../helpers/common/authentication";
import { verifyPassword } from "../helpers/common/crypt";

const throwAuthorizationError = (res: Response, next: NextFunction) => {
    return next(CustomError.getWithMessage("You are not authorized", 401));
}

const headerControl = (res: Response) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res;
}

const getTokenFromHeader = (req: CustomRequest) => {
    const authorization = req.headers.authorization;

    if (!authorization) return null;

    const tokenList = authorization.split(' ');
    if (tokenList.length != 2) return null;

    const token = tokenList[1];
    return token;
}

const controlToken = expressAsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        res = headerControl(res);

        const token = getTokenFromHeader(req);
        if (!token) return throwAuthorizationError(res, next);

        const APP_SECRET_KEY = process.env.APP_SECRET_KEY;
        if (!APP_SECRET_KEY) return throwAuthorizationError(res, next);

        let key, email;
        try {
            const decoded = jwt.decode(token);
            if (!decoded) return throwAuthorizationError(res, next);

            const payload = decoded as ITokenPayload;
            if (!payload.email || !payload.key) return throwAuthorizationError(res, next);
        } catch (decodeErr: any) {
            return throwAuthorizationError(res, next);
        }

        try {
            jwt.verify(token, APP_SECRET_KEY);
        } catch (verifyErr: any) {
            if (!email || !key) return throwAuthorizationError(res, next);

            const responseToken = await generateToken(email, key);
            if (!responseToken.success) return throwAuthorizationError(res, next);

            res.setHeader('Token', responseToken.data);
        }

        next();
    } catch (error) {
        return throwAuthorizationError(res, next);
    }
});

const controlWithHash = expressAsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        res = headerControl(res);

        const APP_SECRET_KEY = process.env.APP_SECRET_KEY;
        if (!APP_SECRET_KEY) return throwAuthorizationError(res, next);

        let nonce = req.headers.nonce;
        let timestamp = req.headers.timestamp;
        let signature = req.headers.signature;

        if (!signature || !nonce || !timestamp) return throwAuthorizationError(res, next);

        nonce = nonce.toString();
        timestamp = timestamp.toString();
        signature = signature.toString();


        const fullString = APP_SECRET_KEY + "&" + nonce + "&" + timestamp;

        const responseVerify = await verifyPassword(fullString, signature);
        if (!responseVerify) return throwAuthorizationError(res, next);

        next();
    } catch (error) {
        return throwAuthorizationError(res, next);
    }
});

export {
    controlToken,
    controlWithHash
}