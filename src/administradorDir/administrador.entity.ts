import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Administrador {
    @PrimaryKey({ nullable: false, unique: true, primary: true })
    cod_administrador !: number
    
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

    @Property({nullable: false})
    contrasenia !: string
}   


