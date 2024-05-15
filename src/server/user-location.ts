import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class UserLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    session: string;
}