import { Entity, ManyToOne, PrimaryKeyProp } from "@mikro-orm/core";
import { Condena } from "../condenaDir/condena.entity.js";
import { Sentencia } from "../sentenciaDir/sentencia.entity.js";



@Entity()
export class composicionCondena {
    @ManyToOne({ primary: true , nullable: false})
    condena !: Condena

    @ManyToOne({ primary: true , nullable: false})
    sentencia !: Sentencia

    [PrimaryKeyProp] !: ['condena','sentencia']

}

