import multer from "multer";
import routes from "./routes";

// multer: handling file upload
// dest : videos/ ==> 파일이 videos라는 폴더안에 저장된다
const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
  // 모든 곳에서 접근 가능한 local변수 선언
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = req.user || null;
  console.log(req.user);
  next();
};

// 로그인 상태에서는 이후 route,함수로 접근 불가
export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

// 로그인 상태에서만 접근 가능
export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

// single: upload only one file at once
export const uploadVideo = multerVideo.single("videoFile");
