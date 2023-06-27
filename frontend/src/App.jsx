import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
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
import { DragLayer } from "./externalnode/DragLayer";
import "./App.css";
import externalNode from "./externalnode/external_node.json";
import ExternalNode from "./externalnode/ExternalNode";
import axios from "axios";
import { Paper, Typography, Box, TextField } from "@mui/material";

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

  //opean all folders
  const [isOpenAll, setIsOpenAll] = useState(false);
  const ref = useRef(null);
  const handleOpenAll = () => ref.current?.openAll();
  const handleCloseAll = () => ref.current?.closeAll();

  //Get the entire folder list # questions??? Cannot get sepecific type
  const axiosFetchData = async () => {
    ///useEffect replace useCallback?
    await axios
      .get(`http://localhost:5000/iterationfolder/${dataType}`, {
        headers: {
          email: "danni@hhsc.ca", // Replace with the appropriate email value
        },
      })
      .then((res) => {
        console.log(res.data);
        const returnedData = res.data.data.output;
        const convertedTreeData = returnedData.map((items) => ({
          id: items.FolderID,
          parent: items.ParentFolderID,
          text: items.FolderName,
          type: items.Type,
          droppable: items.Droppable,
        }));

        console.log(convertedTreeData);
        setTreeData(convertedTreeData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axiosFetchData();
  }, []);

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
    setExternalNodes(
      externalNodes.filter((exnode) => exnode.id !== dragSourceId)
    );
  };

  //Create a new folder #questions??? the id of each node, and the email
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
        console.log(err);
      });

    handleCloseDialog();
  };

  //update the folder name #questions??? error 404
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

  //Delete Folder and keep the sub-folders #questions??? return Error 404
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
        setTreeData((prevTreeData) =>
          prevTreeData.filter((node) => node.id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  // Multiple drag
  /* const [selectedNodes, setSelectedNodes] = useState(null);
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
  }, []); */

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

  //External node
  const [externalNodes, setExternalNodes] = useState(externalNode);
  const [lastId, setlastId] = useState(105);

  const handleAddExternalNode = () => {
    const node = {
      id: lastId,
      parent: 0,
      text: `External node${lastId - 100}`,
    };
    setExternalNodes([...externalNodes, node]);
    setlastId(lastId + 1);
  };

  //Search Bar
  const [query, setQuery] = useState("");

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
        <DragLayer />
        <Tree
          ref={ref}
          tree={treeData}
          rootId={"0"}
          extraAcceptTypes={["EXTERNAL_NODE"]}
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
        <Box
          sx={{
            margin: "10px 20px",
            height: "200px",
            width: "auto",
            overflowY: "auto",
          }}
        >
          <Box sx={{ padding: "15px" }}>
            <TextField
              id="standard-basic"
              label="Search"
              variant="standard"
              onChange={(e) => setQuery(e.target.value)}
            />

            {externalNode
              .filter((node) => node.text.toLocaleLowerCase().includes(query))
              .map((node) => (
                <ExternalNode key={node.id} node={node} />
              ))}
          </Box>
        </Box>
      </DndProvider>
    </div>
  );
}

export default App;
