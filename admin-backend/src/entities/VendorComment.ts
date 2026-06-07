import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { BookingApplication } from "./BookingApplication";
import { User } from "./User";

@Entity()
export class VendorComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => BookingApplication, application => application.comments)
    application!: BookingApplication;

    @ManyToOne(
        () => User,
        user => user.vendorComments
    )
    vendor!: User;
}
