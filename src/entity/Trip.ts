import { 
    PrimaryGeneratedColumn, 
    OneToMany, 
    Entity, 
    Generated, 
    Column } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema:"public"})
export class Trip 
{
    @PrimaryGeneratedColumn("uuid")
    id:number;

    @Column()    
    @Generated("uuid")
    graphId: number;

    @OneToMany(type => Leg, l => l.trip,
    {cascadeInsert: true})
    legs: Leg[];
}