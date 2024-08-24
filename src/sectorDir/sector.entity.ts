import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Sector {
    @PrimaryKey({ nullable: false, unique: true})
    cod_sector !: number

    @Property({ nullable: false, unique: true})
    nombre !: string

    @Property({ nullable: false, unique: false})
    descripcion !: string

    constructor(cod_sector: Sector, nombre: string, descripcion: string) {
        this.nombre = nombre
        this.descripcion = nombre
    }
}