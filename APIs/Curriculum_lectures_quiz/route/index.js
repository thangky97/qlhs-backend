const Curriculum_QuizRoute = require("./Curriculum_Lectures_QuizRoute");

module.exports = [
  {
    method: "POST",
    path: "/quiz/update",
    options: Curriculum_QuizRoute.updateById,
  },

  {
    method: "POST",
    path: "/quiz/get-list",
    options: Curriculum_QuizRoute.find,
  },
  {
    method: "POST",
    path: "/quiz/insert",
    options: Curriculum_QuizRoute.insert,
  },
  {
    method: "POST",
    path: "/quiz/user-get-list",
    options: Curriculum_QuizRoute.getList,
  },
  {
    method: "GET",
    path: "/quiz/get-detail",
    options: Curriculum_QuizRoute.findById,
  },
  {
    method: "GET",
    path: "/quiz/user-get-detail",
    options: Curriculum_QuizRoute.getDetail,
  },
];
