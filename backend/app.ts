import express, { Request, Response } from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
dotenv.config();
import {router as todosRouter} from './routes/routes_todos';
import {router as usersRouter} from './routes/routes_users';
import cookieParser from "cookie-parser";


//express setup
export const app: express.Application = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:4200', credentials: true}));
app.use(cookieParser())
// routes
app.use('/api/todos', todosRouter);
app.use('/api/users', usersRouter);



// main
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});



// server
const PORT = process.env.PORT;
if(process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => console.log(`Server started on port ${PORT}, link: http://localhost:${PORT}/`));
}