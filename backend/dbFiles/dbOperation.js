const config = require("./dbConfig"),
  sql = require("mssql");

//////////////////////////////////
const getIterations = async () => {
  try {
    // console.log('Connecting to database');
    let pool = await sql.connect(config);
    // console.log('Connected to database');
    let Iterations = await pool
      .request()
      .query("SELECT * from IterationTable_test");
    return Iterations.recordset;
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////////////
const getRelations = async () => {
  try {
    // console.log('Connecting to database');
    let pool = await sql.connect(config);
    // console.log('Connected to database');
    let Iterations = await pool
      .request()
      .query("SELECT * from RelationTable_test");
    return Iterations.recordset;
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////
const getfolders = async () => {
  try {
    // console.log('Connecting to database');
    let pool = await sql.connect(config);
    // console.log('Connected to database');
    let Iterations = await pool
      .request()
      .query("SELECT * from FolderTable_test");
    return Iterations.recordset;
  } catch (error) {
    console.log(error);
  }
};
/////////////////////////////////////
const createfolder = async (Iteration) => {
  // console.log("create");
  try {
    let pool = await sql.connect(config);
    let emailID = Iteration.Email.split("@")[0];
    let data = await pool.request().query("SELECT * from FolderTable_test");
    // console.log(data);
    let Iters = data.recordset;
    let flag = 0;
    //to create a unique id
    //"emailID + . + #"
    for (let i = 0; i < Iters.length; i++) {
      if (
        Iters[i].FolderID.split(".")[0] == emailID &&
        flag < Iters[i].FolderID.split(".")[1] * 1
      ) {
        flag = Iters[i].FolderID.split(".")[1] * 1;
      }
      // console.log(flag);
    }

    let id = emailID + "." + (flag + 1);
    // console.log(id)
    let iterations = pool.request().query(
      `insert into FolderTable_test values
            ('${id}','${Iteration.ParentFolderID}','${Iteration.FolderName}','${Iteration.Email}','${Iteration.Type}')`
    );
    // console.log(flag);
    return id;
  } catch (error) {
    console.log(error);
  }
};
////////////////////////////////////////
const updateFolderName = async (id, content) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `UPDATE FolderTable_test SET FolderName = '${content}' WHERE FolderID = '${id}'`
      );
  } catch (error) {
    console.log(error);
  }
};
////////////////////////////////////////
const dragFile = async (id, parent, email, type) => {
  let pool = await sql.connect(config);
  let flag = 0;
  let data = await pool.request().query("SELECT * from RelationTable_test");
  let Iters = data.recordset;
  let check = 0;
  let recordFolder = "";
  let recordEmail = "";
  let temp;
  let typeCheck = "official";

  let folders = await pool.request().query(`SELECT * from FolderTable_test`);
  console.log("folders:", folders);
  console.log("parent:", parent);
  let UpdateFolder = folders.recordset.find(
    (el) => String(el.FolderID) === String(parent)
  );
  let matches = folders.recordset.filter(
    (el) => String(el.FolderID) === String(parent)
  );
  console.log("matches:", matches);

  if (matches.length > 0) {
    let UpdateFolder = matches[0];

    // Check if UpdateFolder is not undefined or null
    if (UpdateFolder) {
      if (type != UpdateFolder.Type) {
        return -1;
      }
      if (email != UpdateFolder.Email) {
        return -2;
      }
    } else {
      console.log("UpdateFolder is undefined or null");
    }
  } else {
    console.log("No matches found");
  }

  /*   if (type != UpdateFolder.recordset[0].Type) {
    return -1;
  }
  if (email != UpdateFolder.recordset[0].Email) {
    return -2;
  } */

  let similarIters = await pool
    .request()
    .query(
      `SELECT * from RelationTable_test WHERE ID = ${
        id * 1
      } and Email = '${email}'`
    );
  // console.log(similarIters.recordsets[0]);
  // return -12;
  for (let j = 0; j < similarIters.recordsets[0].length; j++) {
    //complare the type of the iteration and the existing iteration that share the same ID and email
    temp = await pool
      .request()
      .query(
        `SELECT * from FolderTable_test WHERE FolderID = '${similarIters.recordsets[0][j].FolderID}'`
      );

    typeCheck = temp.recordset[0].Type;
    // console.log(temp.recordset[0].FolderID);
    // console.log(type);
    // console.log(typeCheck);

    if (type === typeCheck) {
      check++;
      recordFolder = temp.recordset[0].FolderID;
      recordEmail = temp.recordset[0].Email;
    }
  }
  if (check === 0) {
    // console.log('ooooo');
    //no such file in any folder before, so create a new row
    let iterations = pool
      .request()
      .input("id", id * 1)
      .input("parent", parent)
      .input("email", email)
      .input("type", type)
      .query(
        `insert into RelationTable_test values
              (@id, @parent, @email, @type)`
      );
  } else {
    // console.log('IIIII');
    let result = await pool.request().query(
      `UPDATE RelationTable_test SET FolderID = '${parent}' WHERE ID = ${
        id * 1
      } AND Email = '${recordEmail}' AND FolderID = '${recordFolder}'
          UPDATE RelationTable_test SET Email = '${email}' WHERE ID = ${
        id * 1
      } AND Email = '${recordEmail}' AND FolderID = '${recordFolder}'
      UPDATE RelationTable_test SET Type = '${type}' WHERE ID = ${
        id * 1
      } AND Email = '${recordEmail}' AND FolderID = '${recordFolder}'`
    );
  }
};
////////////////////////////////////////
const dragFolder = async (id, content) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `UPDATE FolderTable_test SET ParentFolderID = '${content}' WHERE FolderID = '${id}'`
      );
  } catch (error) {
    console.log(error);
  }
};
////////////////////////////////////////
const deleteFolder = async (id) => {
  try {
    let pool = await sql.connect(config);
    let folderData = await pool
      .request()
      .query("SELECT * from FolderTable_test");
    let Iterdata = await pool
      .request()
      .query("SELECT * from RelationTable_test");
    let Folders = folderData.recordset;
    let Iters = Iterdata.recordset;
    //record the old parent value
    let UpdateFolder = await pool
      .request()
      .query(
        `SELECT ParentFolderID from FolderTable_test WHERE FolderID = '${id}'`
      );
    let oldParent = UpdateFolder.recordset[0].ParentFolderID;

    await pool
      .request()
      .query(
        `UPDATE FolderTable_test SET ParentFolderID = '${oldParent}' WHERE ParentFolderID = '${id}'`
      );

    if (oldParent === "0") {
      await pool
        .request()
        .query(`DELETE FROM RelationTable_test WHERE FolderID = '${id}'`);
    } else {
      await pool
        .request()
        .query(
          `UPDATE RelationTable_test SET FolderID = '${oldParent}' WHERE FolderID = '${id}'`
        );
    }

    await pool
      .request()
      .query(`DELETE FROM FolderTable_test WHERE FolderID = '${id}'`);
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////////////
/* const deleteFile = async (id, email) => {
  try {
    let pool = await sql.connect(config);

    let result = await pool
      .request()
      .query(
        `DELETE FROM RelationTable_test WHERE ID = ${
          id * 1
        } AND Email = '${email}'`
      );
  } catch (error) {
    console.log(error);
  }
}; */

module.exports = {
  getIterations,
  getRelations,
  getfolders,
  createfolder,
  updateFolderName,
  dragFile,
  dragFolder,
  deleteFolder,
  // deleteFile,
};
