/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Reservation } from "./Reservation";
import { Transport } from "./Transport";
import { UserAccount } from "./UserAccount";
import { Trip } from "./Trip";

@Entity({schema: "public"})
export class User {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @Column({type: "text", nullable: true})
    firstName: string | null;

    @Column({type: "text", nullable: true})
    lastName: string | null;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => UserAccount,
    userAccount => userAccount.user,
    {cascadeAll: true, eager: true})
    userAccount: UserAccount;

    @OneToMany(type => Reservation, res => res.reservedBy)
    reservations: Reservation[];

    @OneToMany(type => Trip, t => t.createdBy)
    tripsCreated: Trip[]

    @ManyToMany(type => Trip)
    @JoinTable()
    tripsReserved: Trip[]
}
