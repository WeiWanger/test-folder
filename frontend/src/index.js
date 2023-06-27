// index.js
import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import IterationTabs from "./Tabs";

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <IterationTabs />
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
