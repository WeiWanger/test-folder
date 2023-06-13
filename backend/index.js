const express = require("express");
const dbOperation = require("./dbFiles/dbOperation");
const Folder = require("./dbFiles/folder");
const cors = require("cors");

const API_PORT = 5000;
const app = express();

//defining some varaible
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

//Get ALL Folder list API
app.get("/api/iteration", async (req, res) => {
  dbOperation.getIteration().then((iters_read) => {
    res.status(200).json({
      status: "success",
      result: iters_read.length,
      data: {
        iteration: iters_read,
      },
    });
  });
});

//Create a New Folder
app.post("/api/iteration", async (req, res) => {
  const newIteration = req.body;
  console.log(req.body);
  dbOperation.createIteration(newIteration).then((newID) => {
    res.status(201).json({
      status: "success",
      message: `Iteration created with new ID of '${newID}'`,
    });
  });
});

//Update the folder name
//# questions return error status, but the result was successful 
app.patch("/api/iteration/:id", async (req, res) => {
  console.log(req.body);
  await dbOperation
    .updateFolderName(req.params.id, req.body.text)
    .then((error) => {
      if (error) {
        console.log(error);
        res.status(404).json({
          status: "failed",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "iteration text updated",
        });
      }
    });
});

//Delete folders meanwhile keeping sub-folders and sub-files
app.delete("/api/iteration/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (isNaN(id)) {
    dbOperation.getIteration().then((Iters) => {
      if (Iters.find((el) => el.FolderID === id)) {
        dbOperation.deleteFolder(id).then(() => {
          res.status(200).json({
            status: "success",
            message: "Folders deleted",
          });
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Folder is not found",
        });
      }
    });
  } else {
    console.log("file delete actived");
    dbOperation.deleteFile(id, req.body.email).then(() => {
      res.status(200).json({
        status: "success",
        message: "Iteration removed from folders",
      });
    });
  }
});

//Drag files
app.patch("api/iteration/drag/:id", (req, res) => {
  id = req.params.id;
  console.log(req.body);
  if (isNaN(id)) {
    dbOperation.dbOperation
      .dragFolder(req.params.id, req.body.id)
      .then((error) => {
        if (error) {
          console.log(error);
          res.status(404).json({
            status: "failed",
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "Drag Performanced",
          });
        }
      });
  } else {
    dbOperation.createIteration
      .dragFile(req.params.id, req.body.id, req.body.email)
      .then((error) => {
        if (error) {
          console.log(error);
          res.status(404).json({
            status: "failed",
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "Drag Performanced",
          });
        }
      });
  }
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

dbOperation.getIteration().then((res) => {
  console.log(res.recordset);
});

/* dbOperation.createFolder().then((req) => {
  console.log(req);
});

dbOperation.updateFolder().then((req) => {
  console.log(req);
}); */
