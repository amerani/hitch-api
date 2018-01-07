/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn} from "typeorm";
import { User } from "./User";

@Entity({schema: "auth"})
export class UserAccount {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @Column({type: "text", unique: true})
    email: string;

    @Column({type: "text"})
    passwordHash: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => User,
    user => user.userAccount)
    @JoinColumn()
    user: User;
}
