import { Request, Response, Router } from "express";
import * as todosControllers from "../controllers/controllers_todos"
import { verifyToken } from "../authentication/auth";

export const router: Router = Router();

// api/todos
router.get("/", verifyToken, todosControllers.getTodosByUserId)

router.post("/", verifyToken, todosControllers.newTodo);

router.patch("/:id", verifyToken, todosControllers.updateTodo)

router.delete("/:id", verifyToken, todosControllers.deleteTodoByTodoId)



