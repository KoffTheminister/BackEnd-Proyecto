import { Entity, PrimaryKey, Property, ManyToMany, Cascade, ManyToOne, Rel } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { Collection } from "@mikro-orm/core";

@Entity()
export class Actividad {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_actividad ?: number
    
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

    @Property({nullable: false})
    cantidad_minima !: number

    @Property({nullable: false})
    edad_minima !: number

    @ManyToOne(() => Sector, { nullable: true })
    cod_sector !: Rel<Sector>

    @ManyToMany(() => Recluso, (recluso) => recluso.actividades, { unique : false, nullable : true, cascade: [], owner: true})
    reclusos = new Collection<Recluso>(this);
}   




