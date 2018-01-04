import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity({schema: "public"})
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: ReservationType; 

    @Column()
    description: string;

    @Column({type: "decimal"})
    price: number; 

    @ManyToOne(type => User, user => user.reservationsCreated)
    createdBy: User;

    @ManyToOne(type => User, user => user.reservations)
    reservedBy: User;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}

export declare type ReservationType = "seat" | "bed" | "recliner";