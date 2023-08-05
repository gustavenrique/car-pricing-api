import { Database } from 'sqlite3';
import * as TransportStream from 'winston-transport';

export class SQLiteTransport extends TransportStream {
    private db: Database;

    constructor(options?: TransportStream.TransportStreamOptions) {
        super(options);

        this.db = new Database('db.sqlite', (err) => {
            if (err) throw err;
        });
    }

    log(info: any, callback: () => void) {
        setImmediate(() => this.emit('logged', info));

        const query = `INSERT INTO log (calling_method, message, trace_id, date, level) VALUES (?, ?, ?, ?, ?)`;

        this.db.run(
            query,
            [
                info.metadata.callingMethod,
                info.message,
                info.metadata.traceId,
                info.metadata.timestamp,
                info.level,
            ],
            (err) => console.error(err)
        );

        if (callback) callback();
    }
}
