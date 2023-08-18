import { Injectable, LoggerService } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import { SQLiteTransport } from './sqlite.transport';
import { UUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WinstonLogger implements LoggerService {
    private readonly logger: Logger;

    constructor(config: ConfigService) {
        const database = config.get<string>('DB_NAME');

        this.logger = createLogger({
            transports: [
                new SQLiteTransport(database, {
                    level: 'debug', // minimum LogLevel
                    format: format.combine(format.timestamp(), format.json(), format.metadata()),
                }),
            ],
        });

        if (process.env.NODE_ENV !== 'production')
            this.logger.add(
                new transports.Console({
                    level: 'debug',
                    format: format.combine(
                        format.timestamp(),
                        format.ms(),
                        format.printf(({ level, message, timestamp, callingMethod, traceId }) => {
                            const coloredLevel = level == 'error' ? `\x1b[31m${level}\x1b[0m` : `\x1b[35m${level}\x1b[0m`;
                            const coloredCallingMethod = `\x1b[36m${callingMethod}\x1b[0m`;
                            const coloredMessage = `\x1b[33m${message}\x1b[0m`;
                            const formattedDate = new Date(timestamp).toLocaleString();

                            return `${coloredLevel} [${coloredCallingMethod}] - ${formattedDate} - ${coloredMessage} - Trace: ${traceId}`;
                        })
                    ),
                })
            );
    }

    log(callingMethod: string, message: string, traceId: UUID) {
        this.logger.info(message, { traceId, callingMethod });
    }

    error(callingMethod: string, message: string, traceId: UUID) {
        this.logger.error(message, { traceId, callingMethod });
    }

    warn(callingMethod: string, message: string, traceId: UUID) {
        this.logger.warn(message, { traceId, callingMethod });
    }

    debug(callingMethod: string, message: string, traceId: UUID) {
        this.logger.debug(message, { traceId, callingMethod });
    }
}
