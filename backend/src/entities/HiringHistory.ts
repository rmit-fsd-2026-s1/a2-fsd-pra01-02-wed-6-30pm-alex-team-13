import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";

import { User } from "./User";

@Entity()
export class HiringHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    venueName!: string;

    @Column()
    location!: string;

    @Column("text")
    eventName!: string;

    @Column({
        type: "date"
    })
    hireDate!: string;

    @Column()
    starRating!: number;

    @ManyToOne(() => User, user => user.hiringHistory)
    hirer!: User;
}