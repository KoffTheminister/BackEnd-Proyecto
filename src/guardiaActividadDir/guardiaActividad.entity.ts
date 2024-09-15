import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey } from "@mikro-orm/core";
import { Guardia } from "../guardiaDir/guardia.entity.js";
import { Actividad } from "../actividadDir/actividad.entity.js";


@Entity()
export class GuardiaActividad {
    @ManyToOne(() => Guardia, { primary: true, nullable: false })
    cod_guardia !: Rel<Guardia>

    @ManyToOne(() => Actividad, { primary: true, nullable: false })
    cod_actividad !: Rel<Actividad>

    @PrimaryKey({primary : true, unique : false, nullable : false})
    fecha_ini !: Date

    @Property({unique : false, nullable : true})
    fecha_fin_real !: Date

    [PrimaryKeyProp] !: ['cod_actividad', 'cod_guardia', 'fecha_ini'];
}

