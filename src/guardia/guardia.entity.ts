import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Turno } from "../turno/turno.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { EntityManager } from "@mikro-orm/mysql";

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

    async desvincular_turnos(em: EntityManager){ //metodo no verificado, se deben iniciar turnos primero
        this.turnos = new Collection<Turno>(this)
        await em.flush()
    }
    
}
