import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import App from './App'
export default function IterationTabs() {
  return (
    <Tabs aria-label="Basic tabs" defaultValue={0} sx={{ borderRadius: 'lg' }}>
      <TabList>
        <Tab>Official</Tab>
        <Tab>Personal</Tab>
        <Tab>Shared</Tab>
        <Tab>Public</Tab>
      </TabList>
      <TabPanel value={0} sx={{ p: 2 }}>
        <App dataType='official'/>
      </TabPanel>
      <TabPanel value={1} sx={{ p: 2 }}>
      <App dataType='personal'/>
      </TabPanel>
      <TabPanel value={2} sx={{ p: 2 }}>
      <App dataType='shared'/>
      </TabPanel>
      <TabPanel value={3} sx={{ p: 2 }}>
      <App dataType='public'/>
      </TabPanel>
    </Tabs>
  );
}
