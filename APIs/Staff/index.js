var crypto = require("crypto");

function hashPassword(password) {
  const hashedPassword = crypto
    .createHmac("sha256", "ThisIsStaffSecretKey")
    .update(password)
    .digest("hex");
  return hashedPassword;
}

(() => {
  const a = hashPassword("truong");
  console.log(a);
})();
