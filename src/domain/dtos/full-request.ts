import { UUID } from 'crypto';
import { User } from '../entities/user.entity';

export class FullRequest extends Request {
    traceId?: UUID;
    startTime?: number;
    currentUser?: User;
    session?: {
        userId?: number;
    };
}

// declare global {
//     namespace Express {
//         interface Request {
//             traceId?: UUID;
//             startTime?: number;
//             currentUser?: User;
//             session?: {
//                 userId?: number;
//             };
//         }
//     }
// }
