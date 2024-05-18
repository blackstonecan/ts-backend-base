import { Response, NextFunction } from "express";

import CustomRequest from "../helpers/response/CustomRequest";
import CustomError from "../helpers/error/CustomError";
import Respond from "../helpers/response/Respond";
import Log from "../models/common/Log";

const autoMessageText = "Something Went Wrong, Please Try Again Later";

const customErrorHandler = async (err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
    const routerId = req.routerId;
    const actionerId = req.actionerId;

    if (!routerId && routerId !== 0) return send(res, 500, new Respond(false, 500, {}, "Internal Server Error"));
    if (process.env.NODE_ENV === "DEVELOPMENT") console.log(err.error, err.status);

    const message = (err.autoMessage) ? autoMessageText : err.error.message;

    // Logging
    const response = await Log.save(routerId, req.body, message, err.status, false, actionerId);
    if (!response.success) return send(res, 500, new Respond(false, 500, {}, "Internal Server Error"));

    return send(res, err.status, new Respond(false, err.status, {}, message));
};

const customSuccessHandler = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const respond = req.respond;
    const routerId = req.routerId;
    const actionerId = req.actionerId;

    if(!respond) return next(CustomError.getWithMessage("Internal Server Error"));
    if (!routerId && routerId !== 0) return next(CustomError.getWithMessage("Internal Server Error"));

    // Logging
    const response = await Log.save(routerId, req.body, respond, respond.statusCode, true, actionerId);
    if (!response.success) return next(response.data);

    return send(res, respond.statusCode, respond);
};

const send = (res: Response, status: number, data: Respond) => {
    return res.status(status).json(data);
}

export {
    customErrorHandler,
    customSuccessHandler
}