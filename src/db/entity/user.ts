import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

import { Otp } from './otp';

import { Roles } from '../../utils/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: false, type: 'text' })
  firstName!: string;

  @Column({ unique: false, type: 'text' })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'text', enum: Roles, default: Roles.User })
  role!: string;

  @Column({ type: 'boolean', default: false })
  verify!: boolean;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps!: Otp[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;
}
