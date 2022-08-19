import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const todosConnection = {
  host: process.env.host,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
  port: 3340,
}



export class Database {
  private static instance: Database;
  public readonly connection: mysql.Connection;

  private constructor() {
    this.connection = mysql.createConnection(todosConnection);
    this.connection.connect((error) => {
      if (error) { console.log(error); return; }
    
      console.log(`Database status: connected`)
    })
   }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    } 

    return Database.instance;
  }

  useMySql(sql: string, options: any = []) {
    return new Promise<any>((resolve, reject) => {
      this.connection.query(sql, options, (error, result) => {
        if (error) { reject(console.log(error)) };
  
        resolve(result)
      })
    })
  }
}
