import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey, ManyToMany, Cascade } from "@mikro-orm/core";
import { Guardia } from "../guardia/guardia.entity.js";
import { Sector } from "../sector/sector.entity.js";

@Entity()
export class Turno {
    @ManyToOne(() => Guardia, { primary: true, nullable: false })
    cod_guardia !: Rel<Guardia>

    @ManyToOne(() => Sector, { primary: true, nullable: false })
    cod_sector !: Rel<Sector>

    @Property({ nullable: false, primary: true})
    turno !: string

    [PrimaryKeyProp] !: ['cod_sector', 'cod_guardia', 'turno'];
}

