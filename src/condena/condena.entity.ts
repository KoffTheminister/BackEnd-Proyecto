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

    @ManyToMany(() => Sentencia, (sentencia) => sentencia.condenas, { unique : false, nullable : true, owner: true})
    sentencias = new Collection<Sentencia>(this);

    [PrimaryKeyProp] !: ['cod_recluso', 'fecha_ini']
    
}




