const config = require("../config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.DATABASE.DB,
  config.DATABASE.USER,
  config.DATABASE.PASSWORD,
  {
    host: config.DATABASE.HOST,
    dialect: config.DATABASE.dialect,
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
    pool: config.DATABASE.pool,
    logging: console.log,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.language = require("./language.model")(sequelize, Sequelize);
//cms
db.about = require("./cms/about.model")(sequelize, Sequelize);
db.setting = require("./cms/setting.model")(sequelize, Sequelize);

//slide
db.slide = require("./cms/slide.model")(sequelize, Sequelize);

//partner
db.partner = require("./cms/partner/partner.model")(sequelize, Sequelize);

//auth
db.users = require("./auth/user.model")(sequelize, Sequelize);
db.staff = require("./auth/staff.model")(sequelize, Sequelize);

//product
db.product = require("./product/product.model")(sequelize, Sequelize);
db.product_name = require("./product/product-name.model")(sequelize, Sequelize);
db.product_description = require("./product/product-desc.model")(
  sequelize,
  Sequelize
);
//cloud
db.democloudapplications = require("./demoCloud/demo-cloud-application.model")(
  sequelize,
  Sequelize
);

//course
db.course = require("./course/course.model")(sequelize, Sequelize);

//document
db.document = require("./document/document.model")(sequelize, Sequelize);
db.document_label = require("./document/doc-label.model")(sequelize, Sequelize);
db.document_content = require("./document/doc-content.model")(
  sequelize,
  Sequelize
);

db.curriculum_sections = require("./curriculum/curriculum-sections.model")(
  sequelize,
  Sequelize
);
db.notifications = require("./notification/notification.model")(
  sequelize,
  Sequelize
);

db.course_documents = require("./curriculum/course-documents.model")(
  sequelize,
  Sequelize
);
//instructors
db.instructors = require("./instructors/instructors.model")(
  sequelize,
  Sequelize
);
db.courseinstructors = require("./instructors/course_instructors")(
  sequelize,
  Sequelize
);
db.instructorslevels = require("./instructors/instruction_levels")(
  sequelize,
  Sequelize
);

//classroom
db.classroom = require("./classroom/classroom.model")(sequelize, Sequelize);

//classroom
db.department = require("./department/department.model")(sequelize, Sequelize);

//training_programs - chương trình đào tạo
db.training_programs = require("./trainingProgram/training_program.model")(
  sequelize,
  Sequelize
);

//timetable - thoi khoa bieu - lich hoc
db.timetable = require("./timetable/timetable.model")(sequelize, Sequelize);

//kì học
db.semester = require("./semester/semester.model")(sequelize, Sequelize);

//diểm danh
db.roll_call = require("./rollCall/roll-call.model")(sequelize, Sequelize);

//lịch sử diểm danh
db.history = require("./history/history.model")(sequelize, Sequelize);

//quan he
db.product.hasMany(db.product_name, { foreignKey: "product_id" });
db.product_name.belongsTo(db.product, { foreignKey: "id" });
db.product.hasMany(db.product_description, { foreignKey: "product_id" });
db.product_description.belongsTo(db.product, { foreignKey: "id" });

db.notifications.belongsTo(db.users, { foreignKey: "usersId" });

//quan he
db.course.hasMany(db.curriculum_sections, { as: "course" });
db.curriculum_sections.belongsTo(db.course, {
  foreignKey: "courseId",
});

//quan he
db.staff.hasMany(db.curriculum_sections, { as: "course_instructor" });
db.curriculum_sections.belongsTo(db.staff, {
  foreignKey: "instructorId",
});

//quan he
db.product.hasMany(db.curriculum_sections, { as: "sections" });
db.curriculum_sections.belongsTo(db.product, {
  foreignKey: "productId",
});

//quan he
db.department.hasMany(db.staff, { as: "staff" });
db.staff.belongsTo(db.department, {
  foreignKey: "departmentId",
});

//quan he
db.training_programs.hasMany(db.department, { as: "department" });
db.department.belongsTo(db.training_programs, {
  foreignKey: "trainingProgramId",
});

//quan he
db.department.hasMany(db.product, { as: "product" });
db.product.belongsTo(db.department, {
  foreignKey: "departmentId",
});

//quan he
db.product.hasMany(db.semester, { as: "semester" });
db.semester.belongsTo(db.product, {
  foreignKey: "productId",
});

//quan he
db.curriculum_sections.hasMany(db.staff, { as: "staff_curriculum_section" });
db.staff.belongsTo(db.curriculum_sections, {
  foreignKey: "curriculumSectionId",
});

//quan he timetable
db.staff.hasMany(db.timetable, { as: "timetable_staff" });
db.timetable.belongsTo(db.staff, {
  foreignKey: "staffId",
});

db.course.hasMany(db.timetable, { as: "timetable_course" });
db.timetable.belongsTo(db.course, {
  foreignKey: "courseId",
});

db.classroom.hasMany(db.timetable, { as: "timetable_classroom" });
db.timetable.belongsTo(db.classroom, {
  foreignKey: "classroomId",
});

db.semester.hasMany(db.timetable, { as: "timetable_semester" });
db.timetable.belongsTo(db.semester, {
  foreignKey: "semesterId",
});

db.curriculum_sections.hasMany(db.timetable, {
  as: "timetable_curriculum_section",
});
db.timetable.belongsTo(db.curriculum_sections, {
  foreignKey: "curriculumSectionId",
});

//end quan he timetable

//quan he diem danh
db.curriculum_sections.hasMany(db.roll_call, {
  as: "roll_call_curriculum_section",
});
db.roll_call.belongsTo(db.curriculum_sections, {
  foreignKey: "curriculumSectionId",
});

db.staff.hasMany(db.roll_call, { as: "roll_call_user" });
db.roll_call.belongsTo(db.staff, {
  foreignKey: "userId",
});

//end quan he diem danh

module.exports = db;
