import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from "typeorm";

import { User } from "./User";

@Entity()
export class HirerDocument {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    documentType!: string;

    @Column()
    fileName!: string;

    @Column("text")
    fileUrlOrBase64!: string;

    @Column()
    fileType!: string;

    @Column()
    fileSize!: number;

    @CreateDateColumn()
    uploadedAt!: Date;

    @ManyToOne(() => User, user => user.documents)
    hirer!: User;
}