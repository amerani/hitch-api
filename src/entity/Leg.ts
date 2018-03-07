/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn} from "typeorm";
import { Location } from "./Location";
import { Transport } from "./Transport";
import { Trip } from "./Trip";

@Entity({schema: "public"})
export class Leg {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @OneToOne(type => Location, l => l.leg,
    {cascadeInsert: true})
    @JoinColumn()
    origin: Location;

    @OneToOne(type => Location, l => l.leg,
    {cascadeInsert: true})
    @JoinColumn()
    destination: Location;

    @Column({type: "timestamp with time zone"})
    arrival: string;

    @Column({type: "timestamp with time zone"})
    departure: string;

    @OneToOne(type => Transport, t => t.leg,
    {cascadeInsert: true})
    @JoinColumn()
    transport: Transport;

    @ManyToOne(type => Trip, t => t.legs)
    trip: Trip;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    LogInfo() {
        // tslint:disable-next-line:no-console
        console.log(`
        ${this.id}
        ${this.graphId}
        ${this.arrival} - ${this.departure}
        ${this.origin.city} to ${this.destination.city}\n`);
    }
}
