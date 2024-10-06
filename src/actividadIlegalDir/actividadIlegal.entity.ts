import { Entity, PrimaryKey, Property, ManyToMany, Cascade } from "@mikro-orm/core";
import { Recluso } from "../reclusoDir/recluso.entity.js";

@Entity()
export class ActividadIlegal {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_act_ilegal !: number
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: true})
    descripcion ?: string

    @Property({ nullable: false})
    locacion !: string

    @Property({ nullable: false})
    diaDeLaSemana !: number
    
    @Property({ nullable: false})
    horaInicio !: number

    @Property({ nullable: false})
    horaFin !: number

    @Property({ nullable: false})
    estado !: number

    @Property({ nullable: false})
    cantidad_maxima !: number

    @ManyToMany(() => Recluso, (recluso) => recluso.actividades_ilegales, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: true})
    reclusos !: Recluso[]
}   




