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
import { Transport } from "./Transport";

@Entity({schema: "public"})
export class User {

    @PrimaryGeneratedColumn("uuid")
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
    {cascadeAll: true})
    userAccount: UserAccount;

    @OneToMany(type => Reservation, res => res.reservedBy, 
    {cascadeInsert: true})
    reservations: Reservation[]

    @OneToMany(type => Reservation, res => res.createdBy, 
    {cascadeInsert: true})
    reservationsCreated: Reservation[]

    @OneToMany(type => Transport, t => t.createdBy, 
    {cascadeInsert: true})
    transportsCreated: Transport[]

    @OneToMany(type => Transport, t => t.operatedBy, 
    {cascadeInsert: true})
    transportsOperated: Transport[]
}
