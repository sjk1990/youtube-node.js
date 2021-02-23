import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";

// 이하는 순수 passport가 아닌 passport-local-mongoose에서 제공하는
// 간소화 된 함수임

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://polar-sea-27980.herokuapp.com${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

// Strategy: 로그인 방식(local)
passport.use(User.createStrategy());

// 쿠키에서 userid만 가져옴
// passport.serializeUser(User.serializeUser());
// passport 버그로 추정, 예전 형식으로써야 동작함
passport.serializeUser(function (user, done) {
  done(null, user);
});
// 가져온 userid로 사용자 식별
// passport.deserializeUser(User.deserializeUser());

// session에 저장된 데이터를 불러올 때마다 직접 db를 참조하여 user data를 가져옴
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
