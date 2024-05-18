class Respond{
    success: boolean;
    statusCode: number;
    data: object;
    message: string;

    constructor(success: boolean, statusCode: number, data: object, message: string) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default Respond;