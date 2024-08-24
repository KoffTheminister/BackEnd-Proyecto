import { Entity, ManyToOne, PrimaryKeyProp, Rel } from "@mikro-orm/core";
import { Sentencia } from "../sentenciaDir/sentencia.entity.js";
import { Sector } from "../sectorDir/sector.entity.js";

@Entity()
export class sector_sentencia {
    @ManyToOne({ primary: true , nullable: false})
    cod_sector !: Rel<Sector>

    @ManyToOne({ primary: true , nullable: false})
    cod_sentencia !: Rel<Sentencia>

    [PrimaryKeyProp] !: ['cod_sector', 'cod_sentencia'];

    constructor(cod_sector: Sector, cod_sentencia: Sentencia) {
        this.cod_sector = cod_sector;
        this.cod_sentencia = cod_sentencia;
    }
}
