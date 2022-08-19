import { Request, Response } from "express";
import { Database } from "../database/database";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { TokenRequest } from "../authentication/auth";
import  { Todo } from '@todoApp/Todo'
import BackendService from "../services/backend.service";

dotenv.config()

const backendService = new BackendService()
const database = Database.getInstance();

let TodosTable:string = backendService.setEnvironment('todos');

export const getTodosByUserId = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let sql:string = `SELECT * FROM ${TodosTable} WHERE user_id = ?`;
      const todos: Todo[] = await database.useMySql(sql, [authData.userId]);
      res.status(200).json(todos);

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const newTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let newTodo: Todo = {user_id: authData.userId, text: req.body.text, isDone: 0};
      let sql:string = `INSERT INTO ${TodosTable} (user_id, text, isDone) VALUES (?,?,?)`;
      await database.useMySql(sql, [newTodo.user_id, newTodo.text, newTodo.isDone]);
      res.status(201).json({ message: "Todo added" });

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      if (req.body.text) { // update text
        let sqlText:string = `UPDATE ${TodosTable} SET text = ? WHERE id = ? AND user_id = ?`;
        await database.useMySql(sqlText, [req.body.text, req.params.id,authData.userId]);
        res.status(201).json({ message: "Todo updated" });

      } else {  // update isDone
        let sqlGET:string = `SELECT * FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
        const todos: Todo[] = await database.useMySql(sqlGET, [req.params.id,authData.userId]);

        let update:number = todos[0].isDone === 1 ? 0 : 1;

        let sql:string = `UPDATE ${TodosTable} SET isDone = ? WHERE id = ? AND user_id = ?`;
        await database.useMySql(sql, [update, req.params.id, authData.userId]);
        res.status(200).json({ message: "Todo updated" });
      }

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}


export const deleteTodoByTodoId = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let sql:string = `DELETE FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
      await database.useMySql(sql, [req.params.id,authData.userId]);
      res.status(200).json({ message: "Todo deleted" });

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}