import express from "express";

//export default 일 경우 ==> import app from './app'과 같은 형식으로 import
//아래와 같을 경우 ==> import {userRouter} from './router'과 같이 import
export const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send("user index"));
userRouter.get("/edit", (req, res) => res.send("user edit"));
userRouter.get("/password", (req, res) => res.send("user password"));
