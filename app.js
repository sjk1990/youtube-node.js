import express from "express";
//for log
import morgan from "morgan";
//for security
import helmet from "helmet";
//parser
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

const handleHome = (req, res) => res.send("Hello from home!");

const handleProfile = (req, res) => res.send("You are on my profile");

//middleware 마지막 함수 실행 전 원하는 작업 수행등이 목적(user login 여부 체크 등...)
const middleware = (req, res, next) => {
  console.log("this is middleware");
  next();
};

//middleware
//순서대로 진행
//모든 route에 대해 실행, 원하는 위치에 두고 목적에 맞게 실행 가능
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(middleware);

//해당 route에서만 실행
app.get("/", middleware, handleHome);

app.get("/profile", handleProfile);

export default app;
