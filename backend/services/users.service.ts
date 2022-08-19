import { User } from "@todoApp/User";
import { Response } from "express";
import { Database } from "../database/database";
import BackendService from "./backend.service";


const backendService = new BackendService()
const database = Database.getInstance();

let UsersTable:string = backendService.setEnvironment("users")!;

export default class UsersService {
  
  public async checkLogin(email:string, password:string, res: Response): Promise<any> {
    if (!email) return res.json({ error: "Email is required" });
    if (!password) return res.json({ error: "Password is required" });
  
    let sqlFind:string = `SELECT * FROM ${UsersTable} WHERE email = ?`;
    const users: User[] = await database.useMySql(sqlFind, [email]);
  
    if (!users[0]) return res.json({ error: "Email not found" });
    return(users);
  }


  public async checkRegister(name:string, email:string, password:string, confirm:string, res: Response): Promise<any> {
    
    if (!name) {res.json({ error: "Name is required" }); return false };

    if (name.length < 4) {res.json({ error: "Name must be at least 4 characters" }); return false};

    let sqlFindName:string = `SELECT * FROM ${UsersTable} WHERE name = ?`;
    const usersByName: User[] = await database.useMySql(sqlFindName, [name]);

    if (usersByName[0]) {
      if (name === usersByName[0].name) {res.json({ error: "Name already exists" }); return false};
    }

    if (!email) {res.json({ error: "Email is required" }); return false};
    let emailRegex: RegExp = /[\w\.\-\%\!]+@\w+\.\w{2,}/;
    if(!emailRegex.test(email)) {res.json({ error: "Doesn't look like an email address to me" }); return false};

    let sqlFindMail:string = `SELECT * FROM ${UsersTable} WHERE email = ?`;
    const usersByMail: User[] = await database.useMySql(sqlFindMail, [email]);

    if (usersByMail[0]) {
      if (email === usersByMail[0].email) {res.json({ error: "Email already exists" }); return false};
    }


    if (!password) {res.json({ error: "Password is required" }); return false};
    if (password) { if (password.length < 5) {res.json({ error: "Password must be at least 5 characters" }); return false}}
    if (!confirm) {res.json({ error: "Confirm password is required" }); return false};
    if (password !== confirm) {res.json({ error: "Passwords do not match" }); return false};

    return true
  }

  

}