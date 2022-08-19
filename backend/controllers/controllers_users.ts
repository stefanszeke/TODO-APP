import { Request, Response } from "express";
import { useMySql } from "../database/database";
import bcrypt from 'bcrypt'
import { createUserToken } from "../authentication/auth";
import { User } from '@todoApp/User'
import UsersService from '../services/users.service'
import BackendService from "../services/backend.service";

const userService = new UsersService()
const backendService = new BackendService()

let UsersTable:string = backendService.setEnvironment()!;


export const registerUser = async (req: Request, res: Response) => {
  try {

    const { name, email, password, confirm } = req.body;

    // registering user checks
    const toRegister = await userService.checkRegister(name, email, password, confirm, res)
    if (!toRegister) return

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // registering user
    let sqlInsert:string = `INSERT INTO ${UsersTable} (name,email,password) VALUES (?,?,?)`;
    await useMySql(sqlInsert, [name, email, hashedPassword]);

    res.status(201).json({ message: "User created" });
    
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}


export const loginUser = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    // check login data
    const users: User[] = await userService.checkLogin(email, password, res)
    if(!users.length) return;

    // check hashed password
    if (!await bcrypt.compare(password, users[0].password)) return res.json({ error: "Password incorrect" });

    // token creation
    const token = createUserToken(users[0].id!);
    
    // send cookies to client
    res.cookie('SESSIONID', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600000 });
    res.cookie("name", users[0].name, { maxAge: 3600000, sameSite: 'none', secure: true });
    res.status(200).json({ message: "User logged in" });

  } catch (err) {console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}


export const deleteUserById = async (req: Request, res: Response) => {
  try {

    // unprotected still
    let sql:string = `DELETE FROM ${UsersTable} WHERE id = ?`;
    await useMySql(sql, [req.params.id]);
    res.status(200).json({ message: "User deleted" });

  } catch (err) {console.log(err); res.status(500).json({ message: "Something went wrong" }); }

}


export const logoutUser = async (req: Request, res: Response) => {
  try {

    res.clearCookie("name");
    res.clearCookie("SESSIONID");
    res.status(200).json({ message: "User logged out" });

  } catch (err) {console.log(err); res.status(500).json({ message: "Something went wrong" });}
}