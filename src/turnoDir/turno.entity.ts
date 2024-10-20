import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey, ManyToMany, Cascade } from "@mikro-orm/core";
import { Guardia } from "../guardiaDir/guardia.entity.js";
import { Sector } from "../sectorDir/sector.entity.js";


@Entity()
export class Turno {
    @ManyToOne(() => Guardia, { primary: true, nullable: false })
    cod_guardia !: Rel<Guardia>

    @ManyToOne(() => Sector, { primary: true, nullable: false })
    cod_sector !: Rel<Sector>

    @Property({ nullable: false, primary: true})
    turno !: string

    @PrimaryKey({primary : true, unique : false, nullable : false})
    fecha_ini !: Date

    @Property({unique : false, nullable : true, primary : false}) 
    fecha_fin !: Date

    [PrimaryKeyProp] !: ['cod_sector', 'cod_guardia', 'fecha_ini', 'turno'];
}


