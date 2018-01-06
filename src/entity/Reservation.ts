/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Transport } from "./Transport";
import { User } from "./User";

@Entity({schema: "public"})
export class Reservation {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @Column()
    type: ReservationType;

    @Column({type: "text", nullable: true})
    description: string | null;

    @Column({type: "decimal"})
    price: number;

    @ManyToOne(type => User, user => user.reservationsCreated,
    {cascadeAll: true})
    createdBy: User;

    @ManyToOne(type => User, user => user.reservations,
    {cascadeAll: true})
    reservedBy: User;

    @ManyToOne(type => Transport, t => t.reservations,
    {cascadeAll: true})
    transport: Transport;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}

export declare type ReservationType = "seat" | "bed" | "recliner";
