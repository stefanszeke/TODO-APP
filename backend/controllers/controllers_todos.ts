import { Request, Response } from "express";
import {useMySql} from "../database/database";
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { TokenRequest } from "../authentication/auth";

let TodosTable = "todos";
if(process.env.NODE_ENV === 'test') {
  TodosTable = "todos_testing";
}

export const getTodosByUserId = async(req:Request, res:Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async(error:any, authData:any) => {

      if(error) {console.log(error); return res.sendStatus(403)}
      let sql = `SELECT * FROM ${TodosTable} WHERE user_id = ?`;
      const todos:any = await useMySql(sql,[req.params.id]);
      res.status(200).json(todos);
    
    })
  } catch (error) {console.log(error)}
}


export const newTodo = async(req:Request, res:Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async(error:any, authData:any) => {

    let sql =`INSERT INTO ${TodosTable} (user_id, text, isDone) VALUES (?,?,?)`;
    await useMySql(sql, [req.body.user_id, req.body.text, 0]);
    res.status(201).json({message: "Todo added"});

    })
  } catch (error) {console.log(error)}
}


export const updateTodo = async(req:Request, res:Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async(error:any, authData:any) => {

      if(req.body.text) { // update text
        let sqlText = `UPDATE ${TodosTable} SET text = ? WHERE id = ?`;
        await useMySql(sqlText, [req.body.text, req.params.id]);
        res.status(201).json({message: "Todo updated"});
        
      } else {  // update isDone
        let sqlGET = `SELECT * FROM ${TodosTable} WHERE id = ?`;
        const todos:any = await useMySql(sqlGET,[req.params.id]);
      
        let update = todos[0].isDone === 1 ? 0 : 1;
      
        let sql = `UPDATE ${TodosTable} SET isDone = ? WHERE id = ?`;
        await useMySql(sql, [update, req.params.id]);
        res.status(200).json({message: "Todo updated"});
      }

  })
  } catch (error) {console.log(error)}
}


export const deleteTodoByTodoId = async(req:Request, res:Response) => {
  try {

      jwt.verify((req as TokenRequest).token, process.env.secret_key!, async(error:any, authData:any) => {
      let sql = `DELETE FROM ${TodosTable} WHERE id = ?`;
      await useMySql(sql, [req.params.id]);
      res.status(200).json({message: "Todo deleted"});
      
    })
  } catch (error) {console.log(error)}
}