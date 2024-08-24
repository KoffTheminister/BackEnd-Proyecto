import { Cascade, Entity, ManyToMany,  ManyToOne,  PrimaryKey, Property, Rel } from "@mikro-orm/core";

@Entity()
export class Actividad {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_actividad ?: number  // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: true})
    descripcion ?: string

    @Property({ nullable: false})
    locacion !: string

    @Property({ nullable: false})
    diaDeLaSemana !: number  // no vamos a guardar el nombre del dia de la semana, hay que transformarlo siempre y no tiene sentido. pero si vamos a mantener el numero
    
    @Property({ nullable: false})
    horaInicio !: number

    @Property({ nullable: false})
    horaFin !: number
}   









