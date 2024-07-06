import { MongoClient, Db } from "mongodb";

const connectionString = process.env.MONGODB_URI || 'mongodb://8080:8080/libertant' //info de coneccion a la db

const cli = new MongoClient(connectionString)

await cli.connect()

export let db:Db = cli.db('libertant')
