import { Entity, PrimaryKey, Property, ManyToMany } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";
import { Collection } from "@mikro-orm/core";

@Entity()
export class Actividad_Ilegal {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_act_ilegal !: number
    
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

    @Property({ nullable: false})
    estado !: boolean

    @Property({ nullable: false})
    cantidad_maxima !: number

    @ManyToMany(() => Recluso, (recluso) => recluso.actividades_ilegales, { unique : false, nullable : false, owner: true})
    reclusos = new Collection<Recluso>(this);
}   




