import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";

import { Venue } from "./Venue";

@Entity()
export class BlockedTimeSlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "datetime"
  })
  startDateTime!: Date;

  @Column({
    type: "datetime"
  })
  endDateTime!: Date;

  @Column()
  reason!: string;

  @ManyToOne(() => Venue, venue => venue.blockedTimeSlots)
  venue!: Venue;
}