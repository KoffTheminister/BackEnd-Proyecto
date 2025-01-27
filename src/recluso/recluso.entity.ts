import { Entity, PrimaryKey, Property, ManyToMany, Cascade, Collection, ManyToOne, OneToMany } from "@mikro-orm/core";
import { Actividad } from "../actividad/actividad.entity.js";
import { Taller } from "../taller/taller.entity.js";
import { Actividad_Ilegal } from "../actividad_ilegal/actividad_ilegal.entity.js";
import { Condena } from "../condena/condena.entity.js";
import { Celda } from "../celda/celda.entity.js";

@Entity()
export class Recluso {
    @PrimaryKey({ nullable: false, unique: true})
    cod_recluso !: number
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: false})
    apellido !: string

    @Property({ nullable: false})
    dni !: number

    @Property({ nullable: false})
    fecha_nac !: Date

    @ManyToMany(() => Actividad, (actividad) => actividad.reclusos, { unique : false, nullable : true, cascade: [Cascade.ALL], owner: false})
    actividades = new Collection<Actividad>(this)

    @ManyToMany(() => Taller, (taller) => taller.reclusos, { unique : false, nullable : true, cascade: [Cascade.ALL], owner: false})
    talleres = new Collection<Taller>(this)

    @ManyToMany(() => Actividad_Ilegal, (act_ilegal) => act_ilegal.reclusos, { unique : false, nullable : true, owner: false})
    actividades_ilegales = new Collection<Actividad_Ilegal>(this);

    @OneToMany(() => Condena, (condena) => condena.cod_recluso, { unique : false, nullable : true })
    condenas = new Collection<Condena>(this)

    @ManyToOne(() => Celda, { nullable: true, unique: true})
    celda ?: Celda | null
    
    public get_condena_activa(){
        let i = 0
        try{
            while(i < this.condenas.length){
                if(this.condenas[i].fecha_fin_real == null){
                    return this.condenas[i]
                }
                i++
            }
        } catch (error: any){
            console.log(error.message)
        }
        return null
    }
    
}
