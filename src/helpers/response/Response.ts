import CustomError from '../error/CustomError';

class Response {
    success: boolean;
    data: any;

    constructor(success: boolean, data: any = null) {
        this.success = success;
        this.data = data;
    }

    static getError(err: Error, status?: number) : Response {
        return new Response(false, new CustomError(err, status));
    }

    static getCustomError(err: CustomError) : Response{
        return new Response(false, err);
    }

    static getMessageError(message: string, status?: number) : Response{
        return new Response(false, CustomError.getWithMessage(message, status));
    }

    static getSuccess(data: any) : Response {
        return new Response(true, data);
    }
}

export default Response;