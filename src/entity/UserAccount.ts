import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({schema: "auth"})
export class UserAccount {

    @PrimaryGeneratedColumn({type: "integer"})
    id: number;

    @Column({type:"text", unique: true})
    email: string;

    @Column({type: "text"})
    passwordHash: string;

    @OneToOne(type => User,
    user => user.userAccount)
    @JoinColumn()    
    user: User;
}
