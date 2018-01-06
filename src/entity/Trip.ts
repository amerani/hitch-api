import { PrimaryGeneratedColumn, OneToMany, Entity, Generated } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema:"public"})
export class Trip 
{
    @PrimaryGeneratedColumn("uuid")
    id:number;

    @OneToMany(type => Leg, l => l.trip,
    {cascadeInsert: true})
    legs: Leg[];
}