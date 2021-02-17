import passport from "passport";
import User from "./models/User";

// 이하는 순수 passport가 아닌 passport-local-mongoose에서 제공하는
// 간소화 된 함수임

// Strategy: 로그인 방식(local)
passport.use(User.createStrategy());

// 쿠키에서 userid만 가져옴
passport.serializeUser(User.serializeUser());
// 가져온 userid로 사용자 식별
passport.deserializeUser(User.deserializeUser());
