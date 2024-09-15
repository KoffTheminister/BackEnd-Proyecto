import { Entity, PrimaryKey, Property, ManyToMany, Cascade } from "@mikro-orm/core";
import { Condena } from "../condenaDir/condena.entity.js";
import { Sector } from "../sectorDir/sector.entity.js";

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

    @Property( {nullable: false, unique: false} )
    orden_de_gravedad !: number

    @ManyToMany(() => Condena, (condena) => condena.sentencias, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    condenas !: Condena[]

    @ManyToMany(() => Sector, (sector) => sector.sentencias, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    sectores !: Sector[]
}
