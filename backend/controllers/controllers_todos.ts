import { Request, Response } from "express";
import {useMySql} from "../database/database";


export const getPostsByUserId = async(req:Request, res:Response) => {
  let sql = `SELECT * FROM todos WHERE user_id = ?`;
  const todos:any = await useMySql(sql,[req.params.id]);
  res.status(200).json(todos);
}


export const newPost = async(req:Request, res:Response) => {
  let sql =`INSERT INTO todos (user_id, text, isDone) VALUES (?,?,?)`;
  await useMySql(sql, [req.body.user_id, req.body.text, 0]);
  res.status(201).json({message: "Todo added"});
}


export const updatePost = async(req:Request, res:Response) => {
  if(req.body.text) { // update text
    let sqlText = `UPDATE todos SET text = ? WHERE id = ?`;
    await useMySql(sqlText, [req.body.text, req.params.id]);
    res.status(201).json({message: "Todo updated"});
    
  } else {  // update isDone
    let sqlGET = `SELECT * FROM todos WHERE id = ?`;
    const todos:any = await useMySql(sqlGET,[req.params.id]);
  
    let update = todos[0].isDone === 1 ? 0 : 1;
  
    let sql = `UPDATE todos SET isDone = ? WHERE id = ?`;
    await useMySql(sql, [update, req.params.id]);
    res.status(200).json({message: "Todo updated"});
  }
}


export const deletePostByPostId = async(req:Request, res:Response) => {
  let sql = `DELETE FROM todos WHERE id = ?`;
  await useMySql(sql, [req.params.id]);
  res.status(200).json({message: "Todo deleted"});
}