import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
    JoinColumn, 
    Generated } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema: "public"})
export class Location {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()    
    @Generated("uuid")
    graphId: number;

    @Column()
    city: string;

    @OneToOne(type => Leg)
    @JoinColumn()
    leg: Leg;
}