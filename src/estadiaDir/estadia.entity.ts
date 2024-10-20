import { Entity, PrimaryKey, Property, Rel, ManyToOne, PrimaryKeyProp } from "@mikro-orm/core"
import { Recluso } from "../reclusoDir/recluso.entity.js";
import { Celda } from "../celdaDir/celda.entity.js";

@Entity()
export class Estadia {
    @ManyToOne(() => Recluso, { nullable: false, primary: true })
    cod_recluso !: Rel<Recluso>
    
    @ManyToOne(() => Celda, { nullable: false, primary: true })
    cod_celda !: Rel<Recluso>

    @Property({ nullable: false, primary: true })
    fecha_ini !: Date

    @Property({ nullable: true })
    fecha_fin !: Date

    [PrimaryKeyProp] !: ['cod_recluso', 'cod_celda', 'fecha_ini'];

}


