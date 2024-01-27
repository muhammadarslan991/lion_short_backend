import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "otps" })
export class Otp {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  code!: number;

  @Column({ default: false })
  used!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
