import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Guardia {
    @PrimaryKey({ nullable: false, unique: true, primary: true, autoincrement: true })
    cod_guardia !: number
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: false})
    apellido !: string

    @Property({ nullable: false})
    dni !: number

    @Property({ nullable: false})
    fechaIniContrato !: Date

    @Property({ nullable: true})
    fechaFinContrato ?: Date
}   
