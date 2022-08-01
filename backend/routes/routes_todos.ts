import { Request, Response, Router } from "express";
import { connection } from "../database/database";
import * as todosControllers from "../controllers/controllers_todos"


export const router: Router = Router();

// api/todos
router.get("/:id", todosControllers.getPostsByUserId)

router.post("/", todosControllers.newPost);

router.patch("/:id", todosControllers.updatePost)

router.delete("/:id", todosControllers.deletePostByPostId)



