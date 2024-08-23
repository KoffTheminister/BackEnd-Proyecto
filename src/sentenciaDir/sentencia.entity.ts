import { Cascade, Entity, ManyToMany,  ManyToOne,  PrimaryKey, Property, Rel } from "@mikro-orm/core";

@Entity()
export class Sentencia {
    @PrimaryKey( {nullable: false, unique: true})
    cod_sentencia !: number

    @Property( {nullable: false, unique: true} )
    nombre !: string

    @Property( {nullable: true, unique: false} )
    descripcion ?: string
    
    @Property( {nullable: false, unique: false} )
    duracion_anios !: number

    @Property( {nullable: false, unique: false} )
    duracion_meses !: number

    @Property( {nullable: false, unique: false} )
    duracion_dias !: number
    
    /* opc1
    @ManyToMany(() => Condena, Condena => Condena.sentenciasAsignadas, {
        cascade : [Cascade.ALL]
    })

    opc2
    
    */
}

/*

create table sentencia (
	cod_sentencia int primary key auto_increment,
    nombre varchar(40)
	descripcion varchar(500) not null,
    duracion_anios int not null,
    duracion_meses int not null,
    duracion_dias int not null // una duracion total seria la suma de años, meses y dias. los años pueden ser cualquier numero, los meses hasta 11 (porque si no ya seria otro año) y los dias menos de 30 (indistcutible)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4;

*/