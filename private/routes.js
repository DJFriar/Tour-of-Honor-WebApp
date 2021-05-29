module.exports = function (app) {

  app.get("/", async (req,res) => {
    res.render("pages/index");
  })

  app.get("/admin/memorial-editor", async (req, res) => {
    res.render("pages/admin/memorial-editor");
  })
}