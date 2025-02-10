//import { MikroORM } from "@mikro-orm/core";
import { MikroORM} from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv'

dotenv.config()
const user = process.env.db_user
const passwd = process.env.db_passwd
const host = process.env.db_host
const port = process.env.db_port
const name = process.env.db_name

const config = {
    //type: "mysql", //comente esta linea porque me tira error de vez en cuando
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'libertant',
    clientUrl: `mysql://${user}:${passwd}@${host}:${port}/${name}`,
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
//export const orm = await MikroORM.init(config);

export const syncSchema = async() => {
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()  // solo en las etapas de desarrollo
    await generator.createSchema()  // solo en las etapas de desarrollo
    await generator.updateSchema()
}







