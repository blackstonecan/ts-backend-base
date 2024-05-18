import { Request } from 'express';
import Respond from './Respond';

interface CustomRequest extends Request {
    respond?: Respond;
    routerId?: number;
    actionerId?: number;
}

export default CustomRequest;