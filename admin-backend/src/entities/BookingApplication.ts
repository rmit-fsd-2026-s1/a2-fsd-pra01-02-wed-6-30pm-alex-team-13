import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";
import { VendorComment } from "./VendorComment";

@Entity()
export class BookingApplication {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    eventName!: string;
    
    @Column()
    guestCount!: number;

    @Column()
    eventDate!: string;

    @Column()
    startTime!: string;

    @Column()
    endTime!: string;

    @Column({ default: "Pending" })
    status!: string;

    @Column({ default: 0 })
    reputationScore!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, user => user.applications)
    hirer!: User;

    @ManyToOne(() => Venue, venue => venue.applications)
    venue!: Venue;

    @OneToMany(() => VendorComment, comment => comment.application)
    comments!: VendorComment[];
}