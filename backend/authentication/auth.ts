import { Response, Request } from "express";
import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export interface TokenRequest extends Request {
  token: string;
}

// Authorization:Bearer <token>

export const verifyToken = (req:Request, res:Response, next:Function) => {
  const bearerToken = req.cookies.SESSIONID
  if(typeof bearerToken !== 'undefined') {
    (req as TokenRequest).token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

}

export const createUserToken = (userId:number) => {
  const PAYLOAD:JwtPayload = {
    userId: userId,
  }

  const SECRET:string = process.env.secret_key!

  const OPTIONS: SignOptions = {
    expiresIn: "1h",
    algorithm: 'HS256'
  }

  return jwt.sign(PAYLOAD, SECRET, OPTIONS)
}