import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public message: string;

    @Column()
    public calling_method: string;

    @Column()
    public trace_id: UUID;

    @Column()
    public date: Date;

    @Column()
    public level: 'debug' | 'info' | 'warn' | 'error' | 'emerg'; //  TO DO: use an enum

    // @Column()
    // thread?: number;
}
