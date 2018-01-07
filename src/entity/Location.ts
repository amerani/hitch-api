import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
    Generated } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema: "public"})
export class Location {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()    
    @Generated("uuid")
    graphId: number;

    @Column()
    city: string;

    @OneToOne(type => Leg)
    leg: Leg;
}