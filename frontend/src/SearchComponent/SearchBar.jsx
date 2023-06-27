import { useEffect, useState } from "react";
import "./SearchBar.css";
import DataList from "./DataList";
import axios from "axios";

function SearchBar({ dataType }) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  /*   useEffect(() => {
    const fetchData = async () => {
      ///useEffect replace useCallback?
      await axios
        .get(`http://localhost:5000/iterationfolder/${dataType}?q=${query}`, {
          headers: {
            email: "danni@hhsc.ca", // Replace with the appropriate email value
          },
        })
        .then((res) => {
          const returnedData = res.data.data.output;
          console.log(returnedData);
          const convertedTreeData = returnedData.map((items) => ({
            id: items.FolderID,
            parent: items.ParentFolderID,
            text: items.FolderName,
            type: items.Type,
            droppable: items.Droppable,
          }));
          console.log(convertedTreeData);
          setData(convertedTreeData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [query]); */

  return (
    <div className="search_bar">
      <input
        type="text"
        placeholder="Search...."
        className="search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
      </div>
    </div>
  );
}

export default SearchBar;
