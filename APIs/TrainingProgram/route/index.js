const TrainingProgram = require("./TrainingProgramRoute");

module.exports = [
  {
    method: "POST",
    path: "/training_program/update",
    options: TrainingProgram.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/training_program/delete",
  //   options: TrainingProgram.deleteById,
  // },
  {
    method: "POST",
    path: "/training_program/get-list",
    options: TrainingProgram.find,
  },
  {
    method: "POST",
    path: "/training_program/insert",
    options: TrainingProgram.insert,
  },
  {
    method: "GET",
    path: "/training_program/get-detail",
    options: TrainingProgram.findById,
  },
];
