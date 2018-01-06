import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Leg } from "./Leg";

@Entity({schema: "public"})
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    city: string;

    @OneToOne(type => Leg)
    @JoinColumn()
    leg: Leg;
}