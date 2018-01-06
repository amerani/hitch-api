import { 
    Entity, 
    PrimaryColumn, 
    Column, 
    OneToOne, 
    JoinColumn, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    Generated} from 'typeorm';
import { User } from './User';

@Entity({schema: "auth"})
export class UserAccount {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()    
    @Generated("uuid")
    graphId: number;

    @Column({type:"text", unique: true})
    email: string;

    @Column({type: "text"})
    passwordHash: string;

    @CreateDateColumn()
    createdAt: string;
    
    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => User,
    user => user.userAccount)
    @JoinColumn()    
    user: User;
}
