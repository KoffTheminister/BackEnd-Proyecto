import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Turno } from "../turno/turno.entity.js";
import { email } from "valibot";

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

    @OneToMany(() => Turno, (turno) => turno.cod_guardia)
    turnos = new Collection<Turno>(this)
    
    public desvincular_turnos(){ //metodo no verificado, se deben iniciar turnos primero
        if(this.turnos.isInitialized()){
            const today = new Date();
            let i = 0
            while(i = 0, i < this.turnos.length, i++){
                if(this.turnos[i].fecha_fin == null){
                    this.turnos[i].fecha_fin = today
                }
            }
        }
    }
}
