import { Cascade, Collection, Entity, ManyToMany,  ManyToOne,  PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Actividad } from "../actividadDir/actividad.entity.js";

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
}