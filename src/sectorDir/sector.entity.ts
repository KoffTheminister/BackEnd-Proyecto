import { Entity, PrimaryKey, Property, ManyToMany, Cascade } from "@mikro-orm/core";
import { Sentencia } from "../sentenciaDir/sentencia.entity.js";

@Entity()
export class Sector {
    @PrimaryKey({ nullable: false, unique: true})
    cod_sector !: number

    @Property({ nullable: false, unique: true})
    nombre !: string

    @Property({ nullable: false, unique: false})
    descripcion !: string

    @ManyToMany(() => Sentencia, (sentencia) => sentencia.sectores, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: true})
    sentencias !: Sentencia[]
}
