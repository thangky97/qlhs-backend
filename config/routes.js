"use strict";
const UserRoute = require("../APIs/User/route/index");
const Upload = require("../APIs/Upload/route/UploadRoute");
const StaffRoute = require("../APIs/Staff/route/index");
const DocumentRoute = require("../APIs/Documentation/route/index");
const SliderRoute = require("../APIs/CMS/Slider/route/index");
const PartnerRoute = require("../APIs/CMS/Partner/route/index");
const AboutRoute = require("../APIs/CMS/About/route/index");
const SettingRoute = require("../APIs/CMS/Setting/route/index");
const ProductRoute = require("../APIs/Product/route");
const SectionsRoute = require("../APIs/Curriculum_sections/route/index");
const Usersectionprogress = require("../APIs/Usersectionprogress/route/index");
const User_quizsRoute = require("../APIs/User_quiz/route/index");
const Notificateion = require("../APIs/Notification/route/index");
const Course_documentRoute = require("../APIs/Course_documents/route/index");
const LecturesQuizRoute = require("../APIs/Curriculum_lectures_quiz/route/index");
const InstructorsRoute = require("../APIs/Instructors/route/index");
const CourseInstructorsRoute = require("../APIs/Course_instructors/route/index");
const Course_filesRoute = require("../APIs/Course_files/route/index");
const ScheduleRoute = require("../APIs/Schedule/route/index");
const Course_ratingsRoute = require("../APIs/Course_ratings/route/index");
const Course_progressRoute = require("../APIs/Course_progress/route/index");
const Transcript = require("../APIs/Transcript/route/index");
const DemoCloudApplicaion = require("../APIs/Demo_Cloud_Application/route/index");
const Course = require("../APIs/Course/route/index");
const Classroom = require("../APIs/Classroom/route/index");
const Department = require("../APIs/Department/route/index");

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

APIs = APIs.concat(Usersectionprogress);
APIs = APIs.concat(Notificateion);
APIs = APIs.concat(UserRoute);
APIs = APIs.concat(User_quizsRoute);
APIs = APIs.concat(SectionsRoute);
APIs = APIs.concat(StaffRoute);
APIs = APIs.concat(DocumentRoute);
APIs = APIs.concat(Course_documentRoute);
APIs = APIs.concat(ProductRoute);
APIs = APIs.concat(SliderRoute);
APIs = APIs.concat(PartnerRoute);
APIs = APIs.concat(AboutRoute);
APIs = APIs.concat(SettingRoute);
APIs = APIs.concat(InstructorsRoute);
APIs = APIs.concat(CourseInstructorsRoute);
APIs = APIs.concat(LecturesQuizRoute);
APIs = APIs.concat(Course_filesRoute);
APIs = APIs.concat(ScheduleRoute);
APIs = APIs.concat(Course_ratingsRoute);
APIs = APIs.concat(Course_progressRoute);
APIs = APIs.concat(Transcript);
APIs = APIs.concat(DemoCloudApplicaion);
APIs = APIs.concat(Course);
APIs = APIs.concat(Classroom);
APIs = APIs.concat(Department);

// Q Trafic
APIs = APIs.concat(require("../APIs/Intersection/route"));
APIs = APIs.concat(require("../APIs/Q_Traffic_Control_Info/route"));
APIs = APIs.concat(require("../APIs/Camera/route"));

module.exports = APIs;
