import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user';

@Entity({ name: 'otps' })
export class Otp {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	code!: number;

	@Column({ default: false })
	used!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@Column({ type: 'uuid', nullable: false })
	@Index()
	userId!: string;

	@ManyToOne(() => User, (user) => user.otps)
	@JoinColumn({ name: 'userId' })
	user!: User;
}
