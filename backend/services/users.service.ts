import { User } from "@todoApp/User";
import { Response } from "express";
import { useMySql } from "../database/database";

let UsersTable:string;
if (process.env.NODE_ENV === 'production') UsersTable = "users";
if (process.env.NODE_ENV === 'test') UsersTable = "users_testing";

export default class UsersService {
  
  public async checkLogin(email:string, password:string, res: Response): Promise<any> {
    if (!email) return res.json({ error: "Email is required" });
    if (!password) return res.json({ error: "Password is required" });
  
    let sqlFind:string = `SELECT * FROM ${UsersTable} WHERE email = ?`;
    const users: User[] = await useMySql(sqlFind, [email]);
  
    if (!users[0]) return res.json({ error: "Email not found" });
    if (users[0]) return(users);

  }

}