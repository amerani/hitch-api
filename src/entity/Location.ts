import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema: "public"})
export class Location {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    city: string;

    @OneToOne(type => Leg)
    @JoinColumn()
    leg: Leg;
}