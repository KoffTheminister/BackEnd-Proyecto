import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'libertant',
    type: 'mysql',
    clientUrl: 'mysql://nachin:ik12345ik@localhost:3306/libertant', // mysql://username:password@localhost:3306/your_database_name
    highlighter: new SqlHighlighter(),
    debug: true,
    /*
    schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
    */
})


export const syncSchema = async() => {
    const generator = orm.getSchemaGenerator()
    //await generator.dropSchema()  // solo en las etapas de desarrollo
    //await generator.createSchema()  // solo en las etapas de desarrollo
    await generator.updateSchema()
}

