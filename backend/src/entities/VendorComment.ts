import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";

import { BookingApplication } from "./BookingApplication";
import { User } from "./User";

@Entity()
export class VendorComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    comment!: string;

    @Column({
        type: "datetime",
        default: () => "GETDATE()"
    })
    createdAt!: Date;

    @Column({
        type: "datetime",
        default: () => "GETDATE()"
    })
    updatedAt!: Date;

    @ManyToOne(() => BookingApplication, application => application.comments)
    application!: BookingApplication;

    @ManyToOne(
        () => User,
        user => user.vendorComments
    )
    vendor!: User;
}
