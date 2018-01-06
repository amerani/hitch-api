import { PrimaryGeneratedColumn, OneToMany, Entity } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema:"public"})
export class Trip 
{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => Leg, l => l.trip,
    {cascadeInsert: true})
    legs: Leg[];
}