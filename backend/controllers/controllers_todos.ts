import { Request, Response } from "express";
import { useMySql } from "../database/database";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { TokenRequest } from "../authentication/auth";
import  { Todo } from '@todoApp/Todo'

dotenv.config()


let TodosTable:string;
if (process.env.NODE_ENV === 'production') TodosTable = "todos";
if (process.env.NODE_ENV === 'test') TodosTable = "todos_testing";

export const getTodosByUserId = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let sql:string = `SELECT * FROM ${TodosTable} WHERE user_id = ?`;
      const todos: Todo[] = await useMySql(sql, [authData.userId]);
      res.status(200).json(todos);

    })
  } catch (error) { console.log(error) }
}

export const newTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let newTodo: Todo = {user_id: authData.userId, text: req.body.text, isDone: 0};
      let sql:string = `INSERT INTO ${TodosTable} (user_id, text, isDone) VALUES (?,?,?)`;
      await useMySql(sql, [newTodo.user_id, newTodo.text, newTodo.isDone]);
      res.status(201).json({ message: "Todo added" });

    })
  } catch (error) { console.log(error) }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      if (req.body.text) { // update text
        let sqlText:string = `UPDATE ${TodosTable} SET text = ? WHERE id = ? AND user_id = ?`;
        await useMySql(sqlText, [req.body.text, req.params.id,authData.userId]);
        res.status(201).json({ message: "Todo updated" });

      } else {  // update isDone
        let sqlGET:string = `SELECT * FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
        const todos: Todo[] = await useMySql(sqlGET, [req.params.id,authData.userId]);

        let update:number = todos[0].isDone === 1 ? 0 : 1;

        let sql:string = `UPDATE ${TodosTable} SET isDone = ? WHERE id = ? AND user_id = ?`;
        await useMySql(sql, [update, req.params.id, authData.userId]);
        res.status(200).json({ message: "Todo updated" });
      }

    })
  } catch (error) { console.log(error) }
}


export const deleteTodoByTodoId = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let sql:string = `DELETE FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
      await useMySql(sql, [req.params.id,authData.userId]);
      res.status(200).json({ message: "Todo deleted" });

    })
  } catch (error) { console.log(error) }
}