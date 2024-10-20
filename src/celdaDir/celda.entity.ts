import { Entity, PrimaryKey, Property, Rel, ManyToOne, PrimaryKeyProp } from "@mikro-orm/core";
import { Sector } from "../sectorDir/sector.entity.js";

@Entity()
export class Celda {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_celda !: number

    @ManyToOne(() => Sector, { nullable: false, primary : true })
    cod_sector !: Rel<Sector>
    
    @Property({ nullable: false})
    descripcion !: string 
    
    @Property({ nullable: false})
    capacidad !: number
    
    [PrimaryKeyProp] !: ['cod_celda', 'cod_sector'];

    constructor(cod_sector: Sector, descripcion: string, capacidad: number) {
        this.cod_sector = cod_sector;
        this.descripcion = descripcion;
        this.capacidad = this.capacidad
    }
}   





