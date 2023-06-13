const config = require("./dbConfig");
const sql = require("mssql");

//Get All Data
const getIteration = async () => {
  try {
    let pool = await sql.connect(config);
    let iterations = await pool
      .request()
      .query(`SELECT * from iterationFolderTable`);
    // console.log(folders);
    return iterations.recordset;
    console.log(iterations.recordset);
  } catch (error) {
    console.log(error);
  }
};

//Create a new iteration
const createIteration = async (Iteration) => {
  console.log(typeof Iteration.email);
  try {
    let pool = await sql.connect(config);
    let emailID = Iteration.email.split("@")[0];
    let data = await pool.request().query("SELECT * from iterationFolderTable");

    let Iters = data.recordset;
    console.log(data.recordset);
    let flag = 0;
    for (let i = 0; i < Iters.length; i++) {
      if (Iters[i].id.split(".")[0] == emailID) {
        flag = Iters[i].id.split(".")[1] * 1;
      }
    }

    let id = emailID + "." + (flag + 1);
    let iterations = pool.request().query(
      `INSERT INTO iterationFolderTable VALUES 
      ('${id}', '${Iteration.parent}', '${Iteration.email}', '${Iteration.text}',  CAST('${Iteration.droppable}' AS BIT))`
    );
    console.log(1);
    return id;
  } catch (error) {
    console.log(error);
  }
};

//Update the name of folder

const updateFolderName = async (id, content) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `UPDATE iterationFolderTable SET ='${content}' where FolderID ='${id}'`
      );
    return result;
  } catch (error) {
    console.log(error);
  }
};

//Delete folders
const deleteFolder = async (id) => {
  try {
    let pool = await sql.connect(config);
    let folderData = await pool
      .request()
      .query("SELECT * FROM iterationFolderTable ");
    let Iterdata = await pool
      .request()
      .query(`SELECT * FROM iterationFolderTable`);
    let Folders = folderData.recordset;
    let Iters = Iterdata.recordset
    let UpdateFolder = await pool
      .request()
      .query(
        `SELECT ParentFolderID from iterationFolderTable where FolderID ='${id}'`
      );
    let oldParent = UpdateFolder.recordset[0].ParentFolderID;
    for (let i = 0; i < Folders.length; i++) {
      if (Folders[i].ParentFolderID === id) {
        let result = await pool
          .request()
          .query(
            `UPDATE iterationFolderTable SET ParentFolderID = '${oldParent}' WHERE FolderID='${Folders[i].FolderID}'`
          );
      }
    }

    for (let j = 0; j < Iters.length; j++) {
     if(Iters[j].FolderID === id){
      let result = await pool.request().query(
        `UPDATE iterationFolderTable SET FolderID = '${oldParent}' WHERE ID=${Iters[j].ID}`
      )
     }
      
    }

    let result = await pool
      .request()
      .query(`DELETE FROM iterationFolderTable WHERE FolderID='${id}'`);
  } catch (error) {
    console.log(error);
  }
};

//Delete Files
const deleteFile = async (id, email) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request.query(
      `DELETE FROM iterationFolderTable WHERE ID=${
        id * 1
      } AND Email= '${email}'`
    );
  } catch (error) {
    console.log(error);
  }
};

//Drag and Drop Files
const dragFile = async (id, parent, email) => {
  try {
    let pool = await sql.connect(config);
    let flag = 0;
    let data = await pool.request().query(`SELECT * FROM iterationFolderTable`);
    let Iters = data.recordset;
    for (let i = 0; i < Iters.length; i++) {
      if (Iters[i].email === email) {
        if (Iters[i].id === id * 1) {
          flag++;
        }
      }
    }
    if (flag === 0) {
      let iterations = pool.request().query(
        `INSERT INTO iterationFolderTable 
        ('${id * 1}', '${parent}', '${email}')`
      );
    } else {
      let result = await pool.request()
        .query(`UPDATE iterationFolderTable SET id = '${parent}' WHERE id=${
        id * 1
      } AND email = '${email}' 
      UPDATE iterationFolderTable SET email='${email}' WHERE id = ${
        id * 1
      } AND email = '${email}'`);
    }
  } catch (error) {
    console.log(error);
  }
};

const dragFolder = async (id, content) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `UPDATE iterationFolderTable SET parent ='${content}' WHERE ID = '${id}'`
      );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getIteration,
  createIteration,
  updateFolderName,
  deleteFolder,
  deleteFile,
  dragFile,
  dragFolder,
};
