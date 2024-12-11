import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { get_from_guardia } from "../turno/turno.controller.js";

@Entity()
export class Guardia {
    @PrimaryKey({ nullable: false, unique: true, primary: true, autoincrement: true })
    cod_guardia !: number
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: false})
    apellido !: string

    @Property({ nullable: false})
    dni !: number

    @Property({ nullable: false})
    fecha_ini_contrato !: Date

    @Property({ nullable: true})
    fecha_fin_contrato ?: Date | null

    async desvincular_turnos(){
        const today = new Date();
        get_from_guardia(this).then(los_turnos => los_turnos.forEach(un_turno => {
            if(un_turno.fecha_fin == null){
                un_turno.fecha_fin = today
            }
        }))
    }
}
