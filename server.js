/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Ariana Hajizadeh  Student ID: 101471241  Date: 11/12/2025
********************************************************************************/

const express = require("express");

const { Initialize, getAllProjects, getProjectById, getProjectsBySector } = require("./modules/projects");
const path = require("path");
const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));



app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
   res.render("about");
});

app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;

  if (sector) {
    getProjectsBySector(sector)
      .then(projects => res.render("projects", { projects }))
      .catch(() =>
        res.status(404).render("404", { message: `No projects found for sector: "${sector}".`, page: '' })
      );
  } else {
    getAllProjects()
      .then(projects => res.render("projects", { projects }))
      .catch(() =>
        res.status(404).render("404", { message: "No projects found.", page: '' })
      );
  }
});


app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);

  getProjectById(projectId)
    .then(project => res.render("project", { project }))
    .catch(() =>
      res.status(404).render("404", { message: `No project found with ID ${projectId}.`, page: '' })
    );
});

app.use((req, res) => {
  res.status(404).render("404", {
    message: "Ooops, the page you're looking for dont exist.",
    page: ''
  });
});


if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      await Initialize();
      return app(req, res);
    } catch (err) {
     res.send("Initialization failed: " + err);
    }
  };
}
 else {
  const HTTP_PORT = process.env.PORT || 8080;
  Initialize()
    .then(() => {
      app.listen(HTTP_PORT, () => {
        console.log("Server listening on: " + HTTP_PORT);
      });
    })
    .catch((err) => {
      console.log("Failed: " + err);
    });
}

