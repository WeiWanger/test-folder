import * as React from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import App from "./App";
import SearchBar from "./SearchComponent/SearchBar";

export default function IterationTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            justifyContent: "flex",
            margin: "0 25px",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab
            label="Official"
            sx={{ fontFamily: "sans-serif", fontWeight: 600 }}
          />
          <Tab
            label="Personal"
            sx={{ fontFamily: "sans-serif", fontWeight: 600 }}
          />
          <Tab
            label="Shared"
            sx={{ fontFamily: "sans-serif", fontWeight: 600 }}
          />
          <Tab
            label="Public"
            sx={{ fontFamily: "sans-serif", fontWeight: 600 }}
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit)",
        }}
      >
        {value === 0 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "50%", height: "100%" }}>
              <App dataType="official" />
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "90vh",
              }}
            ></Box>
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "50%", height: "100%" }}>
              <App dataType="personal" />
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "90vh",
              }}
            ></Box>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "50%", height: "100%" }}>
              <App dataType="shared" />
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "90vh",
              }}
            ></Box>
          </Box>
        )}
        {value === 3 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "50%", height: "100%" }}>
              <App dataType="public" />
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "90vh",
                // borderLeft: "1px solid #D3D3D3",
              }}
            ></Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
