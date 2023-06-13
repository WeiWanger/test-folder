const TreeData = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: "Folder 1",
  },
  {
    id: 11,
    parent: 0,
    droppable: true,
    text: "Folder 2",
  },
  {
    id: 12,
    parent: 0,
    droppable: true,
    text: "Folder 3",
  },
  {
    id: 2,
    parent: 1,
    droppable: false,
    text: "File 1-1",
  },
  {
    id: 3,
    parent: 1,
    droppable: false,
    text: "File 2-1",
  },
  {
    id: 4,
    parent: 0,
    droppable: true,
    text: "Folder 4",
  },
  {
    id: 5,
    parent: 4,
    droppable: true,
    text: "Folder 4-1",
  },
  {
    id: 6,
    parent: 5,
    droppable: false,
    text: "File 4-1-1",
  },
  {
    id: 7,
    parent: 0,
    droppable: false,
    text: "File 5",
  },
];
export default TreeData;
