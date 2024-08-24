import { Cascade, Collection, Entity, ManyToMany,  ManyToOne,  PrimaryKey, Property, OneToMany } from "@mikro-orm/core";

@Entity()
export class Sentencia {
    @PrimaryKey( {nullable: false, unique: true})
    cod_sentencia !: number

    @Property( {nullable: false, unique: true} )
    nombre !: string

    @Property( {nullable: true, unique: false} )
    descripcion ?: string
    
    @Property( {nullable: false, unique: false} )
    duracion_anios !: number

    @Property( {nullable: false, unique: false} )
    duracion_meses !: number

    @Property( {nullable: false, unique: false} )
    duracion_dias !: number
}
