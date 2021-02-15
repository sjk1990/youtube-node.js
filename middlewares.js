import multer from "multer";
import routes from "./routes";

// multer: handling file upload
// dest : videos/ ==> 파일이 videos라는 폴더안에 저장된다
const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 1,
  };
  next();
};

// single: upload only one file at once
export const uploadVideo = multerVideo.single("videoFile");
