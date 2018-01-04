import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { UserAccount } from "./UserAccount";
import { Reservation } from "./Reservation";

@Entity({schema: "public"})
export class User {

    @PrimaryGeneratedColumn({type: "integer"})
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn()
    createdAt: string;
    
    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => UserAccount, 
    userAccount => userAccount.user, 
    {cascadeAll: true, eager: true})
    userAccount: UserAccount;

    @OneToMany(type => Reservation, res => res.reservedBy)
    reservations: Reservation[]

    @OneToMany(type => Reservation, res => res.createdBy)
    reservationsCreated: Reservation[]
}
