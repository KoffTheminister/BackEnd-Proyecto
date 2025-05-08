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
    
    @Property({nullable: false})
    contrasenia !: string

    @Property({nullable: false})
    es_especial !: boolean
    
    toJSON(){
        const { contrasenia, es_especial, ...safeUser } = this
        return safeUser
    }
}   




