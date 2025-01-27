import { Entity, PrimaryKey, Property, ManyToMany, Cascade } from "@mikro-orm/core";
import { Condena } from "../condena/condena.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { Collection } from "@mikro-orm/core";

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
    orden_de_gravedad !: number

    @ManyToMany(() => Condena, (condena) => condena.sentencias, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    condenas = new Collection<Condena>(this);

    @ManyToMany(() => Sector, (sector) => sector.sentencias, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    sectores = new Collection<Sector>(this);
}


