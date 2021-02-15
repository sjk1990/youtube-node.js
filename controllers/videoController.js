import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    //find all videos
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  //const searchingBy = req.query.term 과 동일한 ES6 문법
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
  } = req;
  // console.log(body, file)
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
  });
  // console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = (req, res) => res.render("videoDetail");

export const editVideo = (req, res) => res.render("editVideo");

export const deleteVideo = (req, res) => res.render("deleteVideo");
