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
    fecha_ini_contrato !: Date

    @Property({ nullable: true, default: null})
    fecha_fin_contrato ?: Date

    @Property({nullable: false})
    contrasenia !: string

    @Property({nullable: false})
    es_especial !: boolean
    
}   




