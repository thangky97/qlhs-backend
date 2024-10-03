"use strict";
const UserRoute = require("../APIs/User/route/index");
const Upload = require("../APIs/Upload/route/UploadRoute");
const StaffRoute = require("../APIs/Staff/route/index");
const DocumentRoute = require("../APIs/Documentation/route/index");
const ProductRoute = require("../APIs/Product/route");
const SectionsRoute = require("../APIs/Curriculum_sections/route/index");
const Notificateion = require("../APIs/Notification/route/index");
const InstructorsRoute = require("../APIs/Instructors/route/index");
const Course = require("../APIs/Course/route/index");
const Classroom = require("../APIs/Classroom/route/index");
const Department = require("../APIs/Department/route/index");
const TrainingProgram = require("../APIs/TrainingProgram/route/index");
const Semester = require("../APIs/Semester/route/index");
const Timetable = require("../APIs/Timetable/route/index");
const RollCall = require("../APIs/Roll_Call/route/index");
const History = require("../APIs//History/route/index");

var APIs = [
  //Upload APIs
  { method: "GET", path: "/uploads/{path*}", options: Upload.getFile },
  {
    method: "POST",
    path: "/upload/upload-media-file",
    options: Upload.uploadMediaFile,
  },
  {
    method: "POST",
    path: "/upload/deleteFile",
    options: Upload.deleteFile,
  },
  {
    method: "POST",
    path: "/upload/upload-media-chunk",
    options: Upload.uploadMediaChunk,
  },
];

APIs = APIs.concat(Notificateion);
APIs = APIs.concat(UserRoute);
APIs = APIs.concat(SectionsRoute);
APIs = APIs.concat(StaffRoute);
APIs = APIs.concat(DocumentRoute);
APIs = APIs.concat(ProductRoute);
APIs = APIs.concat(InstructorsRoute);
APIs = APIs.concat(Course);
APIs = APIs.concat(Classroom);
APIs = APIs.concat(Department);
APIs = APIs.concat(TrainingProgram);
APIs = APIs.concat(Semester);
APIs = APIs.concat(Timetable);
APIs = APIs.concat(RollCall);
APIs = APIs.concat(History);

// Q Trafic
APIs = APIs.concat(require("../APIs/Q_Traffic_Control_Info/route"));

module.exports = APIs;
