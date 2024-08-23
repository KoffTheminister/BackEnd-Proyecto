import { Cascade, Collection, Entity, ManyToMany,  ManyToOne,  OneToMany,  PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Actividad } from "../actividadDir/actividad.entity.js";


@Entity()
export class Guardia {
    @PrimaryKey({ nullable: false, unique: true})
    cod_guardia !: number  // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: false})
    apellido !: string

    @Property({ nullable: false})
    dni !: number

    @Property({ nullable: false})
    fechaIni !: Date

    @Property({ nullable: true})
    fechaFin ?: Date

    @OneToMany(() => Actividad, Actividad => Actividad.miGuardia, {
        cascade: [Cascade.ALL],
      })
    misActividades ?: Actividad[]
}   


