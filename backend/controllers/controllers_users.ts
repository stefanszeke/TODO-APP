import { Request, Response } from "express";
import {useMySql} from "../database/database";

export const registerUser = async (req:Request, res:Response) => {
  const { name,email,password,confirm } = req.body;

  if(!name) return res.json({error: "Name is required"});
  if(name) {if(name.length < 4) return res.json({error: "Name must be at least 4 characters"})}

  if(!email) return res.json({error: "Email is required"});

  let sqlFind =`SELECT * FROM users WHERE name = ? OR email = ?`;
  const users:any = await useMySql(sqlFind,[name,email]);

  if(users[0]) {
    if(name === users[0].name) return res.status(400).json({message: "Name already exists"});
    if(email === users[0].email) return res.status(400).json({message: "Email already exists"});
  }

  if(!password) return res.json({error: "Password is required"});
  if(password) {if(password.length < 5) return res.json({error: "Password must be at least 5 characters"})}
  if(!confirm) return res.json({error: "Confirm password is required"});
  if(password !== confirm) return res.json({error: "Passwords do not match"});

  let sqlInsert = `INSERT INTO users (name,email,password) VALUES (?,?,?)`;
  await useMySql(sqlInsert, [name,email,password]);

  res.status(201).json({message: "User created"});
}

export const loginUser = async (req:Request, res:Response) => {
  const { email, password } = req.body;

  if(!email) return res.json({error: "Email is required"});
  if(!password) return res.json({error: "Password is required"});

  let sqlFind =`SELECT * FROM users WHERE email = ?`;
  const users:any = await useMySql(sqlFind,[email]);

  if(!users[0]) return res.json({error: "Email not found"});
  if(users[0].password !== password) return res.json({error: "Password incorrect"});

  res.cookie("user", users[0].id, {maxAge: 3600000, sameSite:'lax', secure:true});
  res.cookie("name", users[0].name, {maxAge: 3600000, sameSite:'none', secure:true});
  res.status(200).json({message: "User logged in"});
}

export const deleteUserById = async (req:Request, res:Response) => {

  let sql = `DELETE FROM users WHERE id = ?`;
  await useMySql(sql, [req.params.id]);

  res.status(200).json({message: "User deleted"});
}