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
db.role = require("./auth/role.model")(sequelize, Sequelize);

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

//user_token
db.user_tokens = require("./auth/user_token.model")(sequelize, Sequelize);
db.userTokenDetails = require("./auth/user_token_detail.model")(
  sequelize,
  Sequelize
);
db.user_training_historys = require("./auth/user_training_history.model")(
  sequelize,
  Sequelize
);

//document
db.document = require("./document/document.model")(sequelize, Sequelize);
db.document_label = require("./document/doc-label.model")(sequelize, Sequelize);
db.document_content = require("./document/doc-content.model")(
  sequelize,
  Sequelize
);

//curriculum
db.courseprogresses = require("./curriculum/course-progress.model")(
  sequelize,
  Sequelize
);
db.curriculum_sections = require("./curriculum/curriculum-sections.model")(
  sequelize,
  Sequelize
);
db.user_quizs = require("./curriculum/user-quizs.model")(sequelize, Sequelize);
db.transcripts = require("./curriculum/transcript.model")(sequelize, Sequelize);
db.notifications = require("./notification/notification.model")(
  sequelize,
  Sequelize
);
db.usersectionprogress = require("./curriculum/usersectionprogress.model")(
  sequelize,
  Sequelize
);
db.course_documents = require("./curriculum/course-documents.model")(
  sequelize,
  Sequelize
);
db.curriculum_lectures_quizzes =
  require("./curriculum/curriculum-lectures-quiz.model")(sequelize, Sequelize);
db.schedule = require("./curriculum/schedule.model")(sequelize, Sequelize);
//transaction
db.users_product = require("./transaction/user_product.model")(
  sequelize,
  Sequelize
);
db.transaction = require("./transaction/transaction.model")(
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
//course
db.coursevideoss = require("./coures/course_videos")(sequelize, Sequelize);
db.coursefiles = require("./coures/course_files")(sequelize, Sequelize);
db.courseratings = require("./coures/course_ratings")(sequelize, Sequelize);

db.product.hasMany(db.product_name, { foreignKey: "product_id" });
db.product_name.belongsTo(db.product, { foreignKey: "id" });
db.product.hasMany(db.product_description, { foreignKey: "product_id" });
db.product_description.belongsTo(db.product, { foreignKey: "id" });

db.notifications.belongsTo(db.users, { foreignKey: "usersId" });

//quan he
db.product.hasMany(db.curriculum_sections, { as: "course" });
db.curriculum_sections.belongsTo(db.course, {
  foreignKey: "subjectId",
});
//quan he
db.product.hasMany(db.curriculum_sections, { as: "course_instructor" });
db.curriculum_sections.belongsTo(db.instructors, {
  foreignKey: "instructorId",
});

//quan he
db.product.hasMany(db.curriculum_sections, { as: "sections" });
db.curriculum_sections.belongsTo(db.product, {
  foreignKey: "productId",
});

module.exports = db;
