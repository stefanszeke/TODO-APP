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

      let sqlSelect:string = `SELECT * FROM ${TodosTable} WHERE user_id = ? ORDER BY order_id`;
      const todos: Todo[] = await database.useMySql(sqlSelect, [authData.userId]);

      res.status(200).json(todos);

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const newTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let order_id = await database.useMySql(`SELECT MAX(order_id) FROM ${TodosTable} WHERE user_id = ?`, [authData.userId]); 
      let newOrder_id = order_id[0]['MAX(order_id)'] + 1 || 1;

      let newTodo: Todo = {user_id: authData.userId, text: req.body.text, isDone: 0, order_id: newOrder_id};

      let sqlInsert:string = `INSERT INTO ${TodosTable} (user_id, text, isDone, order_id) VALUES (?,?,?,?)`;
      await database.useMySql(sqlInsert, [newTodo.user_id, newTodo.text, newTodo.isDone, newTodo.order_id]);

      res.status(201).json({ message: "Todo added" });

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      if (req.body.text) { // update text
        let sqlUpdateText:string = `UPDATE ${TodosTable} SET text = ? WHERE id = ? AND user_id = ?`;
        await database.useMySql(sqlUpdateText, [req.body.text, req.params.id,authData.userId]);
        res.status(201).json({ message: "Todo updated" });
      
      } else {  // update isDone
        let sqlSelect:string = `SELECT * FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
        const todos: Todo[] = await database.useMySql(sqlSelect, [req.params.id,authData.userId]);

        let update:number = todos[0].isDone === 1 ? 0 : 1;

        let sqlUpdateIsDone:string = `UPDATE ${TodosTable} SET isDone = ? WHERE id = ? AND user_id = ?`;
        await database.useMySql(sqlUpdateIsDone, [update, req.params.id, authData.userId]);
        res.status(200).json({ message: "Todo updated" });
      }

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const reorderTodos = async (req: Request, res: Response) => {
  try {

    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let todo1: Todo = {...req.body.todos[0]}
      let todo2: Todo = {...req.body.todos[1]}

      await database.useMySql(`UPDATE ${TodosTable} SET order_id = ? WHERE id = ? AND user_id = ?`, [todo2.order_id, todo1.id, authData.userId]);
      await database.useMySql(`UPDATE ${TodosTable} SET order_id = ? WHERE id = ? AND user_id = ?`, [todo1.order_id, todo2.id, authData.userId]);
      res.status(201).json({ message: "Todos order updated" });

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}

export const deleteTodoByTodoId = async (req: Request, res: Response) => {
  try {
    jwt.verify((req as TokenRequest).token, process.env.secret_key!, async (error: any, authData: any) => {
      if (error) return res.sendStatus(403)

      let order_id = await database.useMySql(`SELECT order_id FROM ${TodosTable} WHERE user_id = ? AND id = ?`, [authData.userId, req.params.id]);

      let sqlDelete:string = `DELETE FROM ${TodosTable} WHERE id = ? AND user_id = ?`;
      await database.useMySql(sqlDelete, [req.params.id,authData.userId]);
      res.status(200).json({ message: "Todo deleted" });

      let sqlUpdateOrder:string = `UPDATE ${TodosTable} SET order_id = order_id - 1 WHERE user_id = ? AND order_id > ?`;
      await database.useMySql(sqlUpdateOrder, [authData.userId, order_id[0].order_id]);

    })
  } catch (err) { console.log(err); res.status(500).json({ message: "Something went wrong" }); }
}