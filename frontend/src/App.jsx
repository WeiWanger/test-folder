import React, { useCallback, useEffect, useState, useParams } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  getDescendants,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./components/CustomNode";
import { AddDialog } from "./components/AddDialog";
import "./App.css";
// import TreeData from "./data";
import axios from "axios";

/* const getLastId = (treeData) => {
  const reverseArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else {
      return -1;
    }
    return 0;
  });
  if (reverseArray.length > 0) {
    return reverseArray[0].id;
  }
  return 0;
}; */

function compareArray(arr1, arr2) {
  let result = [];
  arr1.forEach((object1) => {
    let found = 0;
    arr2.forEach((object2) => {
      if (object1.id === object2.id && object1.parent === object2.parent) {
        found = true;
      }
    });
    if (!found) {
      result.push(object1);
    }
  });
  return result;
}

function App() {
  const [treeData, setTreeData] = useState([]);

  const handleDrop = async (newTree) => {
    let draggedNode = compareArray(newTree, treeData);
    console.log(draggedNode[0].id);
    const { id, parent, text, email } = draggedNode[0];
    console.log(id, parent, text, email);
    await axios
      .patch(
        "http://localhost:5000/api/iteration/drag/" + id,
        (id, parent, text, email)
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  //Get the entire folder list
  const axiosFetchData = useCallback(async () => {
    await axios
      .get("http://localhost:5000/api/iteration")
      .then((res) => {
        const returnedData = res.data.data.iteration;
        const convertedTreeData = returnedData.map((items) => ({
          id: items.FolderID,
          parent: items.ParentFolderID,
          text: items.FolderName,
          droppable: items.droppable,
        }));
        setTreeData(convertedTreeData);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //Create a new folder
  const handleSubmit = async (newNode) => {
    console.log(newNode);
    //#question: the newNode doesn't have id
    await axios
      .post("http://localhost:5000/api/iteration", newNode)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    handleCloseDialog();
  };

  //update the folder name
  const handleTextChange = async (id, text) => {
    axios
      .patch("http://localhost:5000/api/iteration/" + id, { text })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  //Delete Folder and keep the sub-folders
  const handleDelete = (id) => {
    /* const lastId = getLastId(treeData);
    const targetNode = treeData.find((node) => node.id === id);
    const descendants = getDescendants(treeData, id);
    const partialTree = descendants.map((node) => {
      if (node.parent === targetNode.id) {
        console.log(node);
        console.log(targetNode);
        return {
          ...node,
          id: node.id,
          parent: targetNode.parent,
        };
      }
      if (node.parent !== targetNode.id) {
        return {
          ...node,
          id: node.id + lastId,
          parent: node.parent + lastId,
        };
      }
    });
    const deteledIds = [id];
    const newTree = treeData.filter((node) => !deteledIds.includes(node.id));
    setTreeData([...newTree, ...partialTree]); */
    axios
      .delete("http://localhost:5000/api/iteration/" + id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  

  useEffect(() => {
    axiosFetchData();
  }, []);

  return (
    <div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <CustomNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              onDelete={handleDelete}
              onTextChange={handleTextChange}
            />
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
        <div>
          <div>
            <Button
              onClick={handleOpenDialog}
              startIcon={<AddIcon />}
              varaint="contained"
              sx={{ marginLeft: "20px" }}
            >
              Add Folder
            </Button>
            {open && (
              <AddDialog
                tree={treeData}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
