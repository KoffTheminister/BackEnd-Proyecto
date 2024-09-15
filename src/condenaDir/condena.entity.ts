import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey, ManyToMany, Cascade } from "@mikro-orm/core";
import { Recluso } from "../reclusoDir/recluso.entity.js";
import { Sentencia } from "../sentenciaDir/sentencia.entity.js";



@Entity()
export class Condena {
    @ManyToOne(() => Recluso, { primary: true, nullable: false })
    cod_recluso !: Rel<Recluso>

    @PrimaryKey({primary : true, unique : false, nullable : false})
    fecha_ini !: Date

    @Property({unique : false, nullable : true})
    fecha_fin_estimada !: Date

    @Property({unique : false, nullable : true})
    fecha_fin_real !: Date

    @ManyToMany(() => Sentencia, (sentencia) => sentencia.condenas, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: true})
    sentencias !: Sentencia[]

    [PrimaryKeyProp] !: ['cod_recluso', 'fecha_ini'];
}
