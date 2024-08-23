import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'libertant',
    type: 'mysql',
    clientUrl: 'mysql://dsw:dsw@localhost:3310/libertant',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
})

 export const syncSchema = async() => {
    const generator = orm.getSchemaGenerator()
    /*
    await generator.dropSchema()  // solo en las etapas de desarrollo
    await generator.createSchema()  // solo en las etapas de desarrollo
    */
    await generator.updateSchema()
 }