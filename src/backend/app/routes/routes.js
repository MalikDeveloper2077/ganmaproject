module.exports = app => {
  const controller = require("../controllers/controller.js");
  const router = require("express").Router();

  // set user stake info 
  router.post("/send_message", controller.sendMessage);
  router.post('/sign_transaction', controller.signTransaction);
  router.post('/transfer', controller.transfer);

  app.use("/api", router);
};