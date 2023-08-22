import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    approved: boolean;

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    mileage: number;

    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
