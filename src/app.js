import express from "express";
// for log
import morgan from "morgan";
// for security
import helmet from "helmet";
// parser
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// route
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";

import { localsMiddleware } from "./middlewares";
import "./passport";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet({ contentSecurityPolicy: false }));
// #2.22 video player issues
// app.use(function (req, res, next) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "script-src 'self' https://archive.org"
//   );
//   return next();
// });
app.set("view engine", "pug");
// static: directory에서 file을 보내주는 middleware
// /uploads url로 들어갈 경우 uploads라는 directory(folder)로 들어감
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//브라우저에서 쿠키가 express로 보내지면, session이 쿠키를 받고, 해독함 -> session이 쿠키를 가지고 있음
//이 후, passport가 해독된 해당 쿠키(유저 정보: id)를 이용하여  deserialize를 진행함.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    // cookiesotre를 mongoose를 이용해 mongodb와 연결
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());

app.use(passport.initialize());
// passport.js에서 deserializeUser 함수가 실행됨.
// 이 후, passport가 찾은 사용자 정보를 middleware나 routes의 모든 request object에 할당함.
app.use(passport.session());

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
