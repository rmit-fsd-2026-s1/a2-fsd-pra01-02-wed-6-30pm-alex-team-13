import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {BookingApplication} from "./BookingApplication";
import {BlockedTimeSlot} from "./BlockedTimeSlot";

@Entity()
export class Venue{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    Location!: string;

    @Column()
    capacity!: number;

    @Column("decimal")
    price!: number;

    @Column()
    imageUrl!: string;

    @Column("text")
    description!: string;

    @Column()
    suitabilityKeywords!: string;

    @Column({ default: false })
    featured!: boolean;

    @ManyToOne(() => User, user => user.venues)
    vendor!: User;

    @OneToMany(() => BookingApplication, application => application.venue)
    applications!: BookingApplication[];

    @OneToMany(() => BlockedTimeSlot, blocked => blocked.venue)
    blockedTimeSlots!: BlockedTimeSlot[];
}