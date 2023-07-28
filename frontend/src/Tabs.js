import * as React from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import App from "./App";

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
            margin: "0 25px",
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-around",
            },
          }}
        >
          <Tab
            label="Official"
            sx={{
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
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
            <Box sx={{ width: "100%", height: "100%" }}>
              <App dataType="official" />
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "100%", height: "100%" }}>
              <App dataType="personal" />
            </Box>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "100%", height: "100%" }}>
              <App dataType="shared" />
            </Box>
          </Box>
        )}
        {value === 3 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "100%", height: "100%" }}>
              <App dataType="public" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
