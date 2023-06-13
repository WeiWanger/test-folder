const express = require("express");
const router = express.Router();

router.get("/iterationfolder", (req, res) => {
  const TreeData = [
    {
      id: 1,
      parent: 0,
      droppable: true,
      folder: true,
      text: "Folder 1",
      title: "Folder 1",
    },
    {
      id: 2,
      parent: 1,
      droppable: false,
      folder: false,
      text: "File 1-1",
      title: "File 1-1",
      data: {
        fileType: "csv",
        fileSize: "0.5MB",
      },
    },
    {
      id: 3,
      parent: 1,
      droppable: false,
      folder: false,
      text: "File 1-2",
      title: "File 1-2",
      data: {
        fileType: "text",
        fileSize: "4.8MB",
      },
    },
    {
      id: 4,
      parent: 0,
      droppable: true,
      folder: true,
      text: "Folder 2",
      title: "Folder 2",
    },
    {
      id: 5,
      parent: 4,
      droppable: true,
      folder: true,
      text: "Folder 2-1",
      title: "Folder 2-1",
    },
    {
      id: 6,
      parent: 5,
      droppable: false,
      folder: false,
      text: "File 2-1-1",
      title: "File 2-1-1",
      data: {
        fileType: "image",
        fileSize: "2.1MB",
      },
    },
    {
      id: 7,
      parent: 0,
      droppable: false,
      folder: false,
      text: "File 3",
      title: "File 3",
      data: {
        fileType: "image",
        fileSize: "0.8MB",
      },
    },
  ];
  res.send(TreeData);
});

module.exports = router;
