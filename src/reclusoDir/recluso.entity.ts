import { Entity, PrimaryKey, Property, ManyToMany, Cascade } from "@mikro-orm/core";
import { Actividad } from "../actividadDir/actividad.entity.js";
import { Taller } from "../tallerDir/taller.entity.js";
import { ActividadIlegal } from "../actividadIlegalDir/actividadIlegal.entity.js";

@Entity()
export class Recluso {
    @PrimaryKey({ nullable: false, unique: true})
    cod_recluso !: number  // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: false})
    apellido !: string

    @Property({ nullable: false})
    dni !: number

    @Property({ nullable: false})
    fecha_nac !: Date

    @ManyToMany(() => Actividad, (actividad) => actividad.reclusos, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    actividades !: Actividad[]

    @ManyToMany(() => Taller, (taller) => taller.reclusos, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    talleres !: Taller[]

    @ManyToMany(() => ActividadIlegal, (act_ilegal) => act_ilegal.reclusos, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: false})
    actividades_ilegales !: ActividadIlegal[]
}