const express = require("express");
const dbOperation = require("./dbFiles/dbOperation");

const cors = require("cors");

const API_PORT = 5000;
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
//GET SPECIFIC TYPE//
app.get("/iterationfolder/:type", async (req, res) => {
  let type = req.params.type;
  const { input } = req.query;
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
      ID: "",
      ParentFolderID: "",
      Name: "",
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
            ID: folders_read[i].FolderID,
            ParentFolderID: folders_read[i].ParentFolderID,
            Name: folders_read[i].FolderName,
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
                  ID: files_read[j].ID.toString(),
                  ParentFolderID: files_read[j].FolderID,
                  Name: Iter.IterationName,
                  Email: files_read[j].Email,
                  Type: type,
                  Droppable: false,
                };
                files.push(sample);
              }
            }
          }
        }
      }
    } else {
      if (type === "personal") {
        for (let i = 0; i < folders_read.length; i++) {
          if (
            folders_read[i].Type === type &&
            folders_read[i].Email === email_login
          ) {
            sample = {
              ID: folders_read[i].FolderID,
              ParentFolderID: folders_read[i].ParentFolderID,
              Name: folders_read[i].FolderName,
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
                  email_login === Iter.OwnerEmail
                ) {
                  sample = {
                    ID: files_read[j].ID.toString(),
                    ParentFolderID: files_read[j].FolderID,
                    Name: Iter.IterationName,
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
      } else {
        for (let i = 0; i < folders_read.length; i++) {
          if (
            folders_read[i].Type === type &&
            folders_read[i].Email === email_login
          ) {
            sample = {
              ID: folders_read[i].FolderID,
              ParentFolderID: folders_read[i].ParentFolderID,
              Name: folders_read[i].FolderName,
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
                  (email_login === Iter.OwnerEmail ||
                    email_login === Iter.AuthorEmail)
                ) {
                  sample = {
                    ID: files_read[j].ID.toString(),
                    ParentFolderID: files_read[j].FolderID,
                    Name: IterationName,
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
      }
    }
    let RootFiles = [];
    for (let i = 0; i < Iters_read.length; i++) {
      if (
        (type === "official" && Iters_read[i].OfficialFlag === true) ||
        (type === "public" &&
          Iters_read[i].OfficialFlag === false &&
          Iters_read[i].PublicFlag === true) ||
        (type === "shared" &&
          Iters_read[i].Official === false &&
          Iters_read[i].PublicFlag === false &&
          Iters_read[i].AuthorEmail != Iters_read[i].OwnerEmail &&
          Iters_read[i].AuthorEmail === email_login &&
          Iters_read[i].OwnerEmail) ||
        (type === "personal" &&
          Iters_read[i].Official === false &&
          Iters_read[i].PublicFlag === false &&
          Iters_read[i].AuthorEmail != Iters_read[i].OwnerEmail &&
          Iters_read[i].AuthorEmail === email_login)
      ) {
        sample = {
          ID: Iters_read[i].ID.toString(),
          ParentFolderID: "0",
          Name: Iters_read[i].IterationName,
          Email: folders_read[i].Email,
          Type: type,
          Droppable: false,
        };
        RootFiles.push(sample);
      }
    }
    // console.log(RootFiles);
    for (let i = 0; i < files_read.length; i++) {
      for (let j = 0; j < RootFiles.length; j++) {
        // if(files_read[i].ID === (RootFiles[j].ID*1)){
        //     console.log(files_read[i].ID);
        //     console.log(files_read[i].Email);
        //     console.log(email_login);
        //     console.log(files_read[i].Type);
        //     console.log(type);
        // }
        if (
          files_read[i].ID === RootFiles[j].ID * 1 &&
          files_read[i].Email === email_login &&
          files_read[i].Type === type
        ) {
          RootFiles = RootFiles.filter((item) => item.ID !== RootFiles[j].ID);
        }
      }
    }

    let output = [...folders, ...files, ...RootFiles];
    let length = output.length;
    if (input) {
      for (let i = 0; i < length; i++) {
        output[i].Name = output[i].Name.toLowerCase();
      }
      output = output.filter((item) => item.Name.includes(input.toLowerCase()));
      let SearchOutput = output;
      function ScanUp(id) {
        let check = false;
        if (isNaN(id)) {
          let object = folders_read.find((el) => el.FolderID === id);
          if (object.ParentFolderID === "0") {
            return;
          } else {
            let folder_upper = folders_read.find(
              (el) => el.FolderID === object.ParentFolderID
            );
            sample = {
              ID: folder_upper.FolderID,
              ParentFolderID: folder_upper.ParentFolderID,
              Name: folder_upper.FolderName,
              Email: email_login,
              Type: type,
              Droppable: true,
            };
            SearchOutput.push(sample);
            ScanUp(folder_upper.FolderID);
            check = true;
          }
        } else {
          let object = files_read.find((el) => el.ID === id * 1);
          if (object) {
            let folder_upper = folders_read.find(
              (el) => el.FolderID === object.FolderID
            );
            sample = {
              ID: folder_upper.FolderID,
              ParentFolderID: folder_upper.ParentFolderID,
              Name: folder_upper.FolderName,
              Email: email_login,
              Type: type,
              Droppable: true,
            };
            SearchOutput.push(sample);
            ScanUp(folder_upper.FolderID);
            check = true;
          }
        }
        if (!check) {
          return;
        }
      }

      function ScanDown(id) {
        if (isNaN(id)) {
          let folders_under = folders_read.find(
            (el) => el.ParentFolderID === id
          );
          let files_under = files_read.find((el) => el.FolderID === id);
          if (folders_under) {
            if (typeof folders_under === "object") {
              sample = {
                ID: folders_under.FolderID,
                ParentFolderID: folders_under.ParentFolderID,
                Name: folders_under.FodlerName,
                Email: email_login,
                Type: type,
                Droppable: true,
              };
              SearchOutput.push(sample);
              ScanDown(folders_under.FolderID);
            } else {
              for (let b = 0; b < folders_under.length; b++) {
                sample = {
                  ID: folders_under[b].FolderID,
                  ParentFolderID: folders_under[b].ParentFolderID,
                  Name: folders_under[b].FodlerName,
                  Email: email_login,
                  Type: type,
                  Droppable: true,
                };
                SearchOutput.push(sample);
                ScanDown(folders_under[b].FolderID);
              }
            }
          }

          if (files_under) {
            if (typeof files_under === "object") {
              let Iter = Iters_read.find((el) => el.ID === files_under.ID);
              sample = {
                ID: Iter.ID.toString(),
                ParentFolderID: files_under.FolderID,
                Name: Iter.IterationName,
                Email: email_login,
                Type: type,
                Droppable: false,
              };
              SearchOutput.push(sample);
            } else {
              for (let b = 0; b < folders_under.length; b++) {
                let Iter = Iters_read.find((el) => el === files_under[b].ID);
                sample = {
                  ID: Iter.ID.toString(),
                  ParentFolderID: files_under[b].FolderID,
                  Name: Iter.IterationName,
                  Email: email_login,
                  Type: type,
                  Droppable: false,
                };
                SearchOutput.push(sample);
              }
            }
          }
        } else {
          return;
        }
      }
      length = output.length;
      for (let i = 0; i < length; i++) {
        ScanUp(output[i].ID);
        console.log(i);
        console.log(SearchOutput);
        ScanDown(output[i].ID);
      }
      for (let m = 0; m < SearchOutput.length; m++) {
        for (let n = 0; n < SearchOutput.length; n++) {
          if (m != n && SearchOutput[m].ID === SearchOutput[n].ID) {
            SearchOutput.splice(n, 1);
          }
        }
      }
      //   res.status(200).json({
      //     status: "success",
      //     data: {
      //       SearchOutput,
      //     },
      //   });
      output = SearchOutput;
    }
    res.status(200).json({
      status: "success",
      data: {
        output,
      },
    });
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
  if (newFolder.ParentFolderID === 0) {
    newFolder.ParentFolderID = "0";
  }
  const newParent = newFolder.ParentFolderID;

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
    console.log(newFolder);
    if (folders_read.find((el) => el.FolderName === newFolder.FolderName)) {
      return res.status(404).json({
        status: "fail",
        message:
          "Invalid input: Destination contains a folder with the same name.",
      });
    }

    dbOperation.createfolder(newFolder).then((newID, feedback) => {
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
  console.log("id: ");
  console.log(req.params.id);
  console.log("Name: ");
  console.log(req.body.FolderName);
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
  // console.log("id: ");
  // console.log(id);
  // console.log("email: ");
  // console.log(email_login);
  // console.log("parent: ");
  // console.log(req.body.ParentFolderID);
  //drag folder
  dbOperation.getfolders().then((folders_read) => {
    const folder = folders_read.find(
      (el) => el.FolderID === req.body.ParentFolderID
    );

    if (isNaN(id)) {
      if (!folder) {
        //if the Iteration is not found
        return res.status(404).json({
          status: "fail",
          message: "Invalid folder ID.",
        });
      }
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
      if (req.body.ParentFolderID === "0") {
        dbOperation.deleteFile(id, email_login).then(() => {
          return res.status(200).json({
            status: "success",
            message: "Iteraion removed from folder!",
          });
        });
      } else {
        if (!folder) {
          //if the Iteration is not found
          return res.status(404).json({
            status: "fail",
            message: "Invalid folder ID.",
          });
        } else {
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

app.listen(API_PORT, () => {
  console.log(`App running on port ${API_PORT}...`);
});
