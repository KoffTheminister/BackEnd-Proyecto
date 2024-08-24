import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp } from "@mikro-orm/core";
import { Recluso } from "../reclusoDir/recluso.entity.js";



@Entity()
export class Condena {
    @ManyToOne({primary : true, unique : false, nullable : false})
    cod_recluso !: Rel<Recluso>

    @Property({primary : true, unique : false, nullable : false})
    fecha_ini !: Date

    @Property({unique : false, nullable : false})
    fecha_fin_estimada !: Date

    @Property({unique : false, nullable : true})
    fecha_fin_real !: Date

    [PrimaryKeyProp] !: ['cod_recluso', 'fecha_ini'];

    constructor(cod_recluso: Recluso, fecha_ini: Date) {
        this.cod_recluso = cod_recluso;
        this.fecha_ini = fecha_ini;
    }
}