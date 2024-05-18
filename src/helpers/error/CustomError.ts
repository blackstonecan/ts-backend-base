class CustomError {
    error: Error;
    status: number;
    autoMessage: boolean;

    constructor(error: Error, status: number = 500, autoMessage: boolean = true) {
        this.error = error;
        this.status = status;
        this.autoMessage = autoMessage;
    }

    static getWithMessage(errorText: string, status: number = 500, autoMessage: boolean = true) : CustomError {
        return new CustomError(new Error(errorText), status, autoMessage);
    }
}

export default CustomError;