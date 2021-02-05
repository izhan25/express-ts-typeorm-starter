import { classToPlain, Exclude } from "class-transformer";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

export default abstract class BaseModelEntity<T> extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'uuid' })
    uuid: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    createUuid() {
        this.uuid = uuid()
    }

    constructor(model?: Partial<T>) {
        super()
        Object.assign(this, model)
    }

    toJSON() {
        return classToPlain(this)
    }
}