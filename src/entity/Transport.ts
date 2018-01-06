import { 
    CreateDateColumn, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    OneToMany, 
    UpdateDateColumn, 
    Entity,
    OneToOne
} from "typeorm";
import { User } from "./User";
import { Reservation } from "./Reservation";
import { Leg } from "./Leg";

@Entity({schema: "public"})
export class Transport
{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    type: TransportType;

    @Column()
    description: string;

    @Column()
    capacity: number;

    @Column()
    plateNumber: string;

    @Column()
    ymm: string;

    @ManyToOne(type => User, u => u.transportsCreated, 
    {cascadeAll: true})
    createdBy: User;

    @ManyToOne(type => User, u => u.transportsOperated, 
    {cascadeAll: true})
    operatedBy: User;

    @OneToMany(type => Reservation, r => r.transport, 
    {cascadeInsert: true})
    reservations: Reservation[];

    @OneToOne(type => Leg, l => l.transport,
    {cascadeInsert: true})
    leg: Leg;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}

export declare type TransportType = "car" | "bus" | "rv";