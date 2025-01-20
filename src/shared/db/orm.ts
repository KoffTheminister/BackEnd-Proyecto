//import { MikroORM } from "@mikro-orm/core";
import { MikroORM} from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from '@mikro-orm/mysql';

const config = {
    //type: "mysql", //comente esta linea porque me tira error de vez en cuando
    driver: MySqlDriver,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'libertant',
    clientUrl: 'mysql://nachin:ik12345ik@localhost:3306/libertant', // mysql://username:password@localhost:3306/your_database_name
    highlighter: new SqlHighlighter(),
    allowedGlobalContext: true,
    debug: true,
    
    schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
    
}

export const orm = await MikroORM.init<MySqlDriver>(config);

export const syncSchema = async() => {
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()  // solo en las etapas de desarrollo
    await generator.createSchema()  // solo en las etapas de desarrollo
    await generator.updateSchema()
}




