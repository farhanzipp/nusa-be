import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role.enum";

@Entity('users')
export class UserEntity {
@PrimaryGeneratedColumn()
id: number;

@Column({unique: true})
username: string;

@Column({unique: true})
email: string;

@Column()
password: string;

@Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
})
roles: Role[];
}

