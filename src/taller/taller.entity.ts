import { Entity, PrimaryKey, Property, ManyToMany, Cascade, Collection } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";

@Entity()
export class Taller {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_taller ?: number
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: true})
    descripcion ?: string

    @Property({ nullable: false})
    locacion !: string

    @Property({ nullable: false})
    dia_de_la_semana !: number
    
    @Property({ nullable: false})
    hora_inicio !: number

    @Property({ nullable: false})
    hora_fin !: number

    @Property({nullable: false})
    estado !: boolean

    @ManyToMany(() => Recluso, (recluso) => recluso.talleres, { unique : false, nullable : false, cascade: [Cascade.PERSIST], owner: true})
    reclusos = new Collection<Recluso>(this);
}   



