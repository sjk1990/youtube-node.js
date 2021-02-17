import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
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
    } catch (error) {
      console.log(error);
    }
    // To Do: Log user in
    res.redirect(routes.home);
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // To Do: Process Log Out
  res.redirect(routes.home);
};

export const userDetail = (req, res) => res.render("userDetail");

export const editProfile = (req, res) => res.render("editProfile");

export const changePassword = (req, res) => res.render("changePassword");
