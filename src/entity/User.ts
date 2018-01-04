import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn
} from "typeorm";
import { UserAccount } from "./UserAccount";

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
}
