/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Leg } from "./Leg";
import { Reservation } from "./Reservation";
import { User } from "./User";

@Entity({schema: "public"})
export class Transport {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @Column()
    type: TransportType;

    @Column({type: "text", nullable: true})
    description: string | null;

    @Column()
    capacity: number;

    @Column({type: "text", nullable: true})
    plateNumber: string | null;

    @Column({type: "text", nullable: true})
    ymm: string | null;

    @ManyToOne(type => User, u => u.transportsCreated,
    {cascadeAll: true})
    createdBy: User;

    @ManyToOne(type => User, u => u.transportsOperated,
    {cascadeAll: true})
    operatedBy: User;

    @OneToMany(type => Reservation, r => r.transport,
    {cascadeInsert: true, eager: true})
    reservations: Reservation[];

    @OneToOne(type => Leg, l => l.transport,
    {cascadeInsert: true})
    leg: Leg;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}

export declare type TransportType = "CAR" | "BUS" | "RV";
