const express = require("express");
const dbOperation = require("./dbFiles/dbOperation");
const Folder = require("./dbFiles/folder");
const cors = require("cors");

const port = 5000;
const app = express();

//defining some varaible
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

///////////////////////////////////////////////
//GET ALL Folders//
app.get("/iterationfolder/all", (req, res) => {
  dbOperation.getfolders().then((folders_read) => {
    res.status(200).json({
      status: "success",
      results: folders_read.length,
      data: {
        Iterations: folders_read,
      },
    });
  });
});
////////////////////////////////////////////////////
//GET SPECIFIC TYPE//
app.get("/iterationfolder/:type", async (req, res) => {
  let type = req.params.type;
  let email_login = req.header("email");

  if (
    type === "official" ||
    type === "public" ||
    type === "personal" ||
    type === "shared"
  ) {
    let folders = [];
    let files = [];
    let folders_read = await dbOperation.getfolders();
    let files_read = await dbOperation.getRelations();
    let Iters_read = await dbOperation.getIterations();
    let Iter = Iters_read[0]; //to reduce the space complexity
    let sample = {
      FolderID: "",
      ParentFolderID: "",
      FolderName: "",
      Email: "",
      Type: "",
      Droppable: false,
    };

    if (type === "official" || type === "public") {
      for (let i = 0; i < folders_read.length; i++) {
        if (
          folders_read[i].Type === type &&
          folders_read[i].Email === email_login
        ) {
          sample = {
            FolderID: folders_read[i].FolderID,
            ParentFolderID: folders_read[i].ParentFolderID,
            FolderName: folders_read[i].FolderName,
            Email: folders_read[i].Email,
            Type: type,
            Droppable: true,
          };
          folders.push(sample);
          for (let j = 0; j < files_read.length; j++) {
            if (folders_read[i].FolderID === files_read[j].FolderID) {

              Iter = Iters_read.find((el) => el.ID === files_read[j].ID);
              // console.log(Iter);
              if (
                (Iter.OfficialFlag === true && type === "official") ||
                (Iter.OfficialFlag === false &&
                  Iter.PublicFlag === true &&
                  type === "public")
              ) {
                sample = {
                  FolderID: files_read[j].ID.toString(),
                  ParentFolderID: files_read[j].FolderID,
                  FolderName: "",
                  Email: files_read[j].Email,
                  Type: type,
                  Droppable: false,
                };
                files.push(sample);
              } /*else {
                let update = dbOperation.deleteFile(files_read[j].ID,files_read[j].Email);
              }*/
            }
          }
        }
      }
      let output = [...folders, ...files];
       console.log('output:'+ output);
      res.status(200).json({
        status: "success",
        data: {
          output,
        },
      });
    } else {
      if (type === "personal") {
        for (let i = 0; i < folders_read.length; i++) {
          if (
            folders_read[i].Type === type &&
            folders_read[i].Email === email_login
          ) {
            sample = {
              FolderID: folders_read[i].FolderID,
              ParentFolderID: folders_read[i].ParentFolderID,
              FolderName: folders_read[i].FolderName,
              Email: folders_read[i].Email,
              Type: type,
              Droppable: true,
            };
            folders.push(sample);
            for (let j = 0; j < files_read.length; j++) {
              if (folders_read[i].FolderID === files_read[j].FolderID) {
                Iter = Iters_read.find((el) => el.ID === files_read[j].ID);
                if (
                  Iter.OfficialFlag === false &&
                  Iter.PublicFlag === false &&
                  Iter.OwnerEmail === Iter.AuthorEmail &&
                  email === Iter.OwnerEmail
                ) {
                  sample = {
                    FolderID: files_read[j].ID.toString(),
                    ParentFolderID: files_read[j].FolderID,
                    FolderName: "",
                    Email: folders_read[i].Email,
                    Type: type,
                    Droppable: false,
                  };
                  files.push(sample);
                }
              }
            }
          }
        }
        let output = [...folders, ...files];
        // console.log(output);
        res.status(200).json({
          status: "success",
          data: {
            output,
          },
        });
      } else {
        for (let i = 0; i < folders_read.length; i++) {
          if (
            folders_read[i].Type === type &&
            folders_read[i].Email === email_login
          ) {
            sample = {
              FolderID: folders_read[i].FolderID,
              ParentFolderID: folders_read[i].ParentFolderID,
              FolderName: folders_read[i].FolderName,
              Email: folders_read[i].Email,
              Type: type,
              Droppable: true,
            };
            folders.push(sample);
            for (let j = 0; j < files_read.length; j++) {
              if (folders_read[i].FolderID === files_read[j].FolderID) {
                Iter = Iters_read.find((el) => el.ID === files_read[j].ID);
                if (
                  Iter.OfficialFlag === false &&
                  Iter.PublicFlag === false &&
                  Iter.OwnerEmail != Iter.AuthorEmail &&
                  (email === Iter.OwnerEmail || email === Iter.AuthorEmail)
                ) {
                  sample = {
                    FolderID: files_read[j].ID.toString(),
                    ParentFolderID: files_read[j].FolderID,
                    FolderName: "",
                    Email: folders_read[i].Email,
                    Type: type,
                    Droppable: false,
                  };
                  files.push(sample);
                }
              }
            }
          }
        }
        let output = [...folders, ...files];
        // console.log(output);
        res.status(200).json({
          status: "success",
          data: {
            output,
          },
        });
      }
    }
  } else {
    res.status(404).json({
      status: "fail",
      message: "Invalid type.",
    });
  }
});

////////////////////////////////////////////////////
//SEARCH//
app.get("/iterationfolder/:id", (req, res) => {
  dbOperation.getfolders().then((folders_read) => {
    // console.log(Iters_read);
    const id = req.params.id;
    const folder = folders_read.find((el) => el.FolderID === id);

    if (!folder) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        folder,
      },
    });
  });
});
/////////////////////////////////////////////////////
//CREATE//
app.post("/iterationfolder", (req, res) => {
  const email_login = req.header("email");
  let newFolder = req.body;
  newFolder["Email"] = email_login;
  // console.log(newFolder);
  const newParent = newFolder.ParentFolderID;
    if (newFolder.FolderID === 0){
      newFolder.Folder = "0"
    }
  dbOperation.getfolders().then((folders_read) => {
    const parent = folders_read.find((el) => el.FolderID === newParent);

    if (!parent && newParent !== "0") {
      //
      //if the parent folder does not exist
      return res.status(404).json({
        status: "fail",
        message: "Invalid parent folder ID.",
      });
    }

    dbOperation.createfolder(newFolder).then((newID) => {
      res.status(201).json({
        status: "success",
        message: `Folder created with new ID of '${newID}'`,
      });
    });
  });
});
///////////////////////////////////////////////////////
//MODIFY NAME (only modify folder name)//
app.patch("/iterationfolder/:id", (req, res) => {
  dbOperation.getfolders().then((folders_read) => {
    const id = req.params.id;
    const folder = folders_read.find((el) => el.FolderID === id);

    if (!folder) {
      //if the folder is not found
      return res.status(404).json({
        status: "fail",
        message: "Invalid folder ID.",
      });
    }

    dbOperation
      .updateFolderName(req.params.id, req.body.FolderName)
      .then((error) => {
        if (error) {
          console.log(error);
          res.status(404).json({
            status: "fail",
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "Iteration text updated!",
          });
        }
      });
  });
});
/////////////////////////////////////////////////////////
//DRAG & DROP//
app.patch("/iterationfolder/drag/:id", (req, res) => {
  const id = req.params.id;
  let email_login = req.header("email");
  //drag folder
  dbOperation.getfolders().then((folders_read) => {
    const folder = folders_read.find(
      (el) => el.FolderID === req.body.ParentFolderID
    );
    if (!folder) {
      //if the Iteration is not found
      return res.status(404).json({
        status: "fail",
        message: "Invalid folder ID.",
      });
    } else {
      if (isNaN(id)) {
        dbOperation.getfolders().then((folders_read) => {
          const folder = folders_read.find((el) => el.FolderID === id);

          if (!folder || id === req.body.ParentFolderID) {
            //if the folder is not found
            return res.status(404).json({
              status: "fail",
              message: "Invalid folder ID.",
            });
          }

          dbOperation
            .dragFolder(id, req.body.ParentFolderID, email_login)
            .then((feedback) => {
              if (feedback === -1) {
                res.status(404).json({
                  status: "fail",
                  message: "Invalid Operation: inconsistent type.",
                });
              } else {
                res.status(200).json({
                  status: "success",
                  message: "Drag Performed!",
                });
              }
            });
        });
      } else {
        //drag file
        dbOperation.getIterations().then((Iters_read) => {
          const Iter = Iters_read.find((el) => el.ID === id * 1);
          if (!Iter) {
            //if the Iteration is not found
            return res.status(404).json({
              status: "fail",
              message: "Invalid iteration ID.",
            });
          }

          //Determine the type of the iteration
          let type = "official";
          if (!Iter.OfficialFlag) {
            type = "public";
            if (!Iter.PublicFlag) {
              if (Iter.AuthorEmail === Iter.OwnerEmail) {
                type = "personal";
              } else {
                type = "shared";
              }
            }
          }

          dbOperation
            .dragFile(id, req.body.ParentFolderID, email_login, type)
            .then((feedback) => {
              if (feedback === -1) {
                res.status(404).json({
                  status: "fail",
                  message: "Invalid Operation: inconsistent type.",
                });
              } else {
                if (feedback === -2) {
                  res.status(404).json({
                    status: "fail",
                    message: "Invalid Operation: inconsistent users.",
                  });
                } else {
                  res.status(200).json({
                    status: "success",
                    message: `Drag Performed! Iteration type: ${type}`,
                  });
                }
              }
            });
        });
      }
    }
  });
});

/////////////////////////////////////////////////////////
//DELETE Folder//
app.delete("/iterationfolder/:id", (req, res) => {
  const email_login = req.header("email");
  id = req.params.id;
  if (isNaN(id)) {
    //delete folder
    dbOperation.getfolders().then((Iters) => {
      // console.log(Iters);
      if (Iters.find((el) => el.FolderID == id)) {
        dbOperation.deleteFolder(id).then(() => {
          res.status(200).json({
            status: "success",
            message: "Folder deleted!",
          });
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: "Folder not found. ",
        });
      }
    });
  } else {
    //delete file
    dbOperation.getRelations().then((Iters_read) => {
      const Iter = Iters_read.find((el) => el.ID === id * 1);
      if (!Iter) {
        //if the Iteration is not found
        return res.status(404).json({
          status: "fail",
          message: "Invalid iteration ID.",
        });
      }

      dbOperation.deleteFile(id, email_login).then(() => {
        res.status(200).json({
          status: "success",
          message: "Iteraion removed from folder!",
        });
      });
    });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
