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

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => UserAccount,
    userAccount => userAccount.user,
    {cascadeAll: true, eager: true})
    userAccount: UserAccount;

    @OneToMany(type => Reservation, res => res.reservedBy,
    {cascadeInsert: true})
    reservations: Reservation[];

    @OneToMany(type => Reservation, res => res.createdBy,
    {cascadeInsert: true})
    public reservationsCreated: Reservation[];

    @OneToMany((type) => Transport, (t) => t.createdBy,
    {cascadeInsert: true})
    transportsCreated: Transport[];

    @OneToMany((type) => Transport, (t) => t.operatedBy,
    {cascadeInsert: true})
    public transportsOperated: Transport[];

    @OneToMany(type => Trip, t => t.createdBy,
    {cascadeInsert: true})
    tripsCreated: Trip[]

    @ManyToMany(type => Trip)
    @JoinTable()
    tripsReserved: Trip[]
}
