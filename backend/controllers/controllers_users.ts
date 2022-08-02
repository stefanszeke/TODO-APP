import { Request, Response } from "express";
import {useMySql} from "../database/database";
import bcrypt from 'bcrypt'
import { createUserToken } from "../authentication/auth";

export const registerUser = async (req:Request, res:Response) => {
  try {
  const { name,email,password,confirm } = req.body;

  if(!name) return res.json({error: "Name is required"});
  if(name) {if(name.length < 4) return res.json({error: "Name must be at least 4 characters"})}

  let sqlFindName =`SELECT * FROM users WHERE name = ?`;
  const usersByName:any = await useMySql(sqlFindName,[name]);

  if(usersByName[0]) {
    if(name === usersByName[0].name) return res.json({error: "Name already exists"});
  }


  if(!email) return res.json({error: "Email is required"});

  let sqlFindMail =`SELECT * FROM users WHERE email = ?`;
  const usersByMail:any = await useMySql(sqlFindMail,[email]);

  if(usersByMail[0]) {
    if(email === usersByMail[0].email) return res.json({error: "Email already exists"});
  }


  if(!password) return res.json({error: "Password is required"});
  if(password) {if(password.length < 5) return res.json({error: "Password must be at least 5 characters"})}
  if(!confirm) return res.json({error: "Confirm password is required"});
  if(password !== confirm) return res.json({error: "Passwords do not match"});

  // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let sqlInsert = `INSERT INTO users (name,email,password) VALUES (?,?,?)`;
    await useMySql(sqlInsert, [name,email,hashedPassword]);
    
    res.status(201).json({message: "User created"});
  } catch(error) {
    console.log(error)
  }
}

export const loginUser = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;

    if(!email) return res.json({error: "Email is required"});
    if(!password) return res.json({error: "Password is required"});
  
    let sqlFind =`SELECT * FROM users WHERE email = ?`;
    const users:any = await useMySql(sqlFind,[email]);
  
    if(!users[0]) return res.json({error: "Email not found"});

    // check hashed password
    if(!await bcrypt.compare(password, users[0].password)) return res.json({error: "Password incorrect"});

    // token creation
    const token = createUserToken(users[0].id);
    res.cookie('SESSIONID', token, {httpOnly: true, secure:true, sameSite:'none', maxAge: 3600000});

  
    res.cookie("user", users[0].id, {maxAge: 3600000, sameSite:'none', secure:true});
    res.cookie("name", users[0].name, {maxAge: 3600000, sameSite:'none', secure:true});
    res.status(200).json({message: "User logged in"});
  } catch(error) {
    console.log(error)
  }

}

export const deleteUserById = async (req:Request, res:Response) => {

  let sql = `DELETE FROM users WHERE id = ?`;
  await useMySql(sql, [req.params.id]);

  res.status(200).json({message: "User deleted"});
}