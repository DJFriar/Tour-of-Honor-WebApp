module.exports = function (app) {

  app.get("/", async (req,res) => {
    res.render("pages/index");
  })

  app.get("/admin/memorial-editor", async (req, res) => {
    res.render("pages/admin/memorial-editor");
  })

  app.get("/admin/memorial-metadata", async (req, res) => {
    res.render("pages/admin/memorial-metadata");
  })

  app.get("/admin/user-management", async (req, res) => {
    res.render("pages/admin/user-management");
  })

  app.get("/sponsor/state-management", async (req, res) => {
    res.render("pages/sponsor/state-management");
  })

  app.get("/user-profile", async (req, res) => {
    res.render("pages/user-profile");
  })
}