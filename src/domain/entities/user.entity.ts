import { AfterInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    active: boolean;

    @Column()
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    afterInsert() {}
}
