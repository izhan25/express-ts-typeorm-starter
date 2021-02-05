import { IsEmail, Length } from "class-validator";
import { Entity, Column, BeforeInsert } from "typeorm";
import { Exclude } from 'class-transformer';
import BaseModelEntity from "./base-model.entity";
import bcrypt from 'bcrypt'

@Entity('users')
export class User extends BaseModelEntity<User> {

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Length(3, 255, { message: 'Username must be atleast 3 charcters long' })
    @Column({ unique: true })
    username: string;

    @Exclude()
    @Length(6, 255)
    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }
}
