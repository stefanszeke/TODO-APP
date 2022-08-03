import { User } from "@todoApp/User";
import { Response } from "express";
import { useMySql } from "../database/database";
import BackendService from "./backend.service";

const backendService = new BackendService()
let UsersTable:string = backendService.setEnvironment()!;

export default class UsersService {
  
  public async checkLogin(email:string, password:string, res: Response): Promise<any> {
    if (!email) return res.json({ error: "Email is required" });
    if (!password) return res.json({ error: "Password is required" });
  
    let sqlFind:string = `SELECT * FROM ${UsersTable} WHERE email = ?`;
    const users: User[] = await useMySql(sqlFind, [email]);
  
    if (!users[0]) return res.json({ error: "Email not found" });
    return(users);

  }

}