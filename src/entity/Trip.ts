/* tslint:disable:member-access */
/* tslint:disable:arrow-parens */

import {
    Column,
    Entity,
    Generated,
    OneToMany,
    PrimaryGeneratedColumn, 
    OneToOne,
    JoinColumn,
    ManyToOne} from "typeorm";
import { Leg } from "./Leg";
import { User } from "./User";

@Entity({schema: "public"})
export class Trip {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @Generated("uuid")
    graphId: number;

    @ManyToOne(type => User, u => u.tripsCreated,
    {cascadeInsert: true})
    createdBy: User;

    @OneToMany(type => Leg, l => l.trip,
    {cascadeInsert: true})
    legs: Leg[];
}
