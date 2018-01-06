import { 
    Entity, 
    PrimaryGeneratedColumn, 
    OneToOne, 
    Column, 
    UpdateDateColumn, 
    CreateDateColumn } from "typeorm";
import { Location } from "./Location";
import { Transport } from "./Transport";


@Entity({schema: "public"})
export class Leg 
{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Location, l => l.leg,
    {cascadeInsert: true})
    origin: Location;

    @OneToOne(type => Location, l => l.leg,
    {cascadeInsert: true})
    destination: Location;

    @Column({type: "timestamp with time zone"})
    arrival: string;

    @Column({type: "timestamp with time zone"})
    departure: string;

    @OneToOne(type => Transport, t => t.leg,
    {cascadeInsert: true})
    transport: Transport;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()    
    updatedAt: string;
}

