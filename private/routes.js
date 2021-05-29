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

  app.get("/admin/rider-management", async (req, res) => {
    res.render("pages/admin/rider-management");
  })
}