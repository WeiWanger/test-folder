import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  isAncestor,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./components/CustomNode";
import { AddDialog } from "./components/AddDialog";
import "./App.css";
import axios from "axios";
import {
  Snackbar,
  Box,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";

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

function App({ dataType }) {
  const [treeData, setTreeData] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const [errorMessage, setErrorMessage] = useState(null);

  //opean all folders
  const [isOpenAll, setIsOpenAll] = useState(false);
  const ref = useRef(null);
  const handleOpenAll = () => ref.current?.openAll();
  const handleCloseAll = () => ref.current?.closeAll();

  //Get the entire folder list # questions??? Cannot get sepecific type
  const [query, setQuery] = useState("");
  const axiosFetchData = async () => {
    await axios
      .get(`http://localhost:5000/iterationfolder/${dataType}?input=${query}`, {
        headers: {
          email: "danni@hhsc.ca", // Replace with the appropriate email value
        },
      })
      .then((res) => {
        console.log(res.data);
        const returnedData = res.data.data.output;
        console.log(returnedData);
        // const searchedData = res.data.data.SearchOutput;
        // console.log(searchedData);
        const convertedTreeData = returnedData.map((items) => ({
          id: items.ID,
          parent: items.ParentFolderID,
          text: items.Name,
          type: items.Type,
          droppable: items.Droppable,
        }));

        /*   const searchedTreeData = searchedData.map((item) => ({
          id: item.ID,
          parent: item.ParentFolderID,
          text: item.Name,
          type: item.Type,
          droppable: item.Droppable,
        })); */
        setTreeData(convertedTreeData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axiosFetchData();
  }, [query]);

  //drag and drop funcitonality
  const handleDrop = async (newTree, options) => {
    console.log(newTree);
    const { dragSourceId } = options;

    let draggedNode = compareArray(newTree, treeData);
    console.log(draggedNode[0].id);
    const { id, parent } = draggedNode[0];
    console.log(parent);
    await axios
      .patch(
        "http://localhost:5000/iterationfolder/drag/" + id,
        { ParentFolderID: parent },
        {
          headers: {
            email: "danni@hhsc.ca", // Replace with the appropriate email value
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setTreeData(newTree);
  };

  //Create a new folder
  const handleSubmit = async (newNode) => {
    console.log("newnode");
    console.log(newNode);
    await axios
      .post("http://localhost:5000/iterationfolder", newNode, {
        headers: {
          email: "danni@hhsc.ca", // Replace with the appropriate email value
        },
      })
      .then((res) => {
        console.log(res.data);
        setTreeData((prevTreeData) => [...prevTreeData, newNode]);
        axiosFetchData();
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrorMessage(err.response.data.message);
        setOpen(true);
      });

    handleCloseDialog();
  };

  //update the folder
  const handleTextChange = async (id, text) => {
    console.log(text);
    axios
      .patch("http://localhost:5000/iterationfolder/" + id, {
        FolderName: text,
      })
      .then((res) => {
        console.log(res);
        setTreeData((prevTreeData) =>
          prevTreeData.map((node) =>
            node.id === id ? { ...node, text } : node
          )
        );
      })
      .catch((err) => console.log(err));
  };

  //Delete Folder
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
      .delete("http://localhost:5000/iterationfolder/" + id, {
        headers: {
          email: "danni@hhsc.ca", // Replace with the appropriate email value
        },
      })
      .then((res) => {
        console.log(res);
        axiosFetchData();
      })
      .catch((err) => console.log(err));
  };

  // Multiple drag
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCtrlPressing, setIsCtrlPressing] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "escape") {
        setSelectedNodes([]);
      } else if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressing(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === "control" || e.key.toLowerCase() === "meta") {
        setIsCtrlPressing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //single node selection
  const handleSingleSelect = (node) => {
    setSelectedNodes(node);
  };

  //Multi node selection
  const handleMultiSelect = (clickedNode) => {
    const selectIds = selectedNodes.map((node) => node.id);

    //ignore if the clicked node is already selected
    if (selectIds.includes(clickedNode.id)) {
      return;
    }
    //ignore if ancestor node is alredy selected
    if (
      selectIds.some((selectedId) =>
        isAncestor(treeData, selectedId, clickedNode.id)
      )
    ) {
      return;
    }

    let updateNodes = [...selectedNodes];

    //if descendant nodes already selected , rmove them
    updateNodes = updateNodes.filter((selectedNode) => {
      return !isAncestor(treeData, clickedNode.id, selectedNode.id);
    });
    updateNodes = [...updateNodes, clickedNode];
    setSelectedNodes(updateNodes);
  };

  const handleClick = (e, node) => {
    if (e.ctrlKey || e.metaKey) {
      handleMultiSelect(node);
    } else {
      handleSingleSelect(node);
    }
  };

  const handleDragStart = (node) => {
    const isSelectedNode = selectedNodes.some((n) => n.id === node.id);
    setIsDragging(true);

    if (!isCtrlPressing && isSelectedNode) {
      return;
    }
    if (!isCtrlPressing) {
      setSelectedNodes([node]);
      return;
    }

    if (!selectedNodes.some((n) => n.id === node.id)) {
      setSelectedNodes([...selectedNodes, node]);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsCtrlPressing(false);
    setSelectedNodes([]);
  };

  return (
    <div className="app">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Box
          sx={{
            margin: "10px 20px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenAll}
            sx={{ margin: "0 10px" }}
          >
            Open All
          </Button>
          <Button variant="outlined" size="small" onClick={handleCloseAll}>
            Close All
          </Button>

          {/* Add functionality: addDialog componenet */}
          <Box sx={{ display: "flex", justifyContent: "stretch" }}>
            <Box>
              <Button
                onClick={handleOpenDialog}
                startIcon={<AddIcon />}
                variant="contained"
                sx={{ marginLeft: "20px" }}
                size="small"
              >
                Add Folder
              </Button>
              {open && (
                <AddDialog
                  tree={treeData}
                  onClose={handleCloseDialog}
                  onSubmit={handleSubmit}
                  dataType={dataType}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            justifyContent: "flex-start",
            display: "flex",
            margin: "0 20px",
          }}
        >
          <TextField
            id="search-bar"
            label="search..."
            variant="outlined"
            size="small"
            value={query}
            sx={{ marginLeft: "10px" }}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ClearIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery("");
                    }}
                  />
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Box>
        <Tree
          ref={ref}
          tree={treeData}
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <CustomNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              isSelected={node.id === selectedNodes?.id}
              onSelect={handleSingleSelect}
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
      </DndProvider>
      <Snackbar
        open={!!errorMessage} // Open if there's an error message
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
          setErrorMessage(null);
        }} // Clear error message on close
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Adjust position here
      >
        <Alert
          onClose={() => {
            setOpen(false);
            setErrorMessage(null);
          }} // Clear error message on close
          severity="info"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
