import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Venue} from "./Venue";
import {BookingApplication} from "./BookingApplication";
import {VendorComment} from "./VendorComment";
import {HirerDocument} from "./HirerDocument";
import {HiringHistory} from "./HiringHistory";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    role!: string; // hirer, vendor, admin

    @Column({ nullable: true })
    phone!: string;

    @Column({ type: "text", nullable: true })
    avatar!: string;

    @Column({ type: "datetime", default: () => "GETDATE()" })
    dateJoined!: Date;

    @OneToMany(() => Venue, venue => venue.vendor)
    venues!: Venue[];

    @OneToMany(() => BookingApplication, application => application.hirer)
    applications!: BookingApplication[];

    @OneToMany(() => VendorComment, comment => comment.vendor)
    vendorComments!: VendorComment[];

    @OneToMany(() => HirerDocument, document => document.hirer)
    documents!: HirerDocument[];

    @OneToMany(() => HiringHistory, history => history.hirer)
    hiringHistory!: HiringHistory[];
}