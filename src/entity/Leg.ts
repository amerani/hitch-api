import { 
    Entity, 
    PrimaryGeneratedColumn, 
    OneToOne, 
    Column, 
    UpdateDateColumn, 
    CreateDateColumn, 
    ManyToOne,
    Generated} from "typeorm";
import { Location } from "./Location";
import { Transport } from "./Transport";
import { Trip } from "./Trip";


@Entity({schema: "public"})
export class Leg 
{
    @PrimaryGeneratedColumn("uuid")
    id:number;

    @Column()    
    @Generated("uuid")
    graphId: number;

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

    @ManyToOne(type => Trip, t => t.legs,
    {cascadeInsert: true})
    trip: Trip;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()    
    updatedAt: string;
}

