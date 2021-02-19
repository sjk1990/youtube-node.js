import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  //   console.log(req.body);
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      // mongoose function, just create, do not save
      const user = await User({
        name,
        email,
      });
      // console.log(user);
      // passport-local-mongoose function
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

// github로그인시 사용자는 github url로 이동하고, github으로 인증요청을 보냄
export const githubLogin = passport.authenticate("github");

// 로그인 요청 후 사용자는 github callback url로 돌아오고,
// callboack함수(사용자 정보)를 받아옴
export const githubLoginCallback = async (_, __, profile, cb) => {
  // console.log(accessToken, refreshToken, profile, cb);
  const {
    _json: { id, avatar_url, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      // githubLoginCallback 함수의 조건으로 cb(callback)함수를 리턴해야 함
      // cb를 리턴하면 passport가 해당 user로 쿠키를 만들고, 저장한 후 브라우저로 전송함.
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// callback url로 돌아온 이후 과정 처리
export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // passport를 사용할 경우 로그아웃 -> req.logout()
  // passport가 쿠키 등을 처리해줌
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  // console.log("getme:::", req.user);
  const {
    user: { _id },
  } = req;
  try {
    const user = await User.findById({ _id: _id }).populate("videos");
    // console.log("getme:::", user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  // console.log("userdetail:::", req.params);
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById({ _id: id }).populate("videos");
    // console.log("userdetail:::", user);
    // console.log("loggedIn", req.user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => res.render("editProfile");

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      // 실패 status를 설정해서 브라우저에게 인식시킴
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    console.log(req.body);
    // changePassword: passport-local-mongoose에서 지원하는 함수
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
