import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey, ManyToMany, Cascade } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";
import { Sentencia } from "../sentencia/sentencia.entity.js";
import { Collection } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/mysql";

@Entity()
export class Condena {
    @ManyToOne(() => Recluso, { nullable: false,  primary: true })
    cod_recluso !: Rel<Recluso>

    @PrimaryKey({primary : true, unique : false, nullable : false})
    fecha_ini !: Date

    @Property({unique : false, nullable : true})
    fecha_fin_estimada ?: Date

    @Property({unique : false, nullable : true})
    fecha_fin_real ?: Date

    @ManyToMany(() => Sentencia, (sentencia) => sentencia.condenas, { unique : false, nullable : true, cascade: [Cascade.ALL], owner: true})
    sentencias = new Collection<Sentencia>(this);
    //sentencias !: Sentencia[]

    [PrimaryKeyProp] !: ['cod_recluso', 'fecha_ini'];
    
    async agregar_sentencias(unas_sentencias: Sentencia[], em: EntityManager){
        let duracion_en_anios = 0
        unas_sentencias.forEach(una_sentencia => {
            this.sentencias.add(una_sentencia)
            duracion_en_anios += una_sentencia.duracion_anios
        })
        this.fecha_fin_estimada = new Date()
        this.fecha_fin_estimada.setFullYear(this.fecha_fin_estimada.getFullYear() + duracion_en_anios);
        await em.flush()
        console.log(this)
    }
    
}


