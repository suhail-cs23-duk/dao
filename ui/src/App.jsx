import { useState } from "react";
import * as React from "react";
import { useContracts } from './web3/useContracts';
import TokenInfo from './components/TokenInfo';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const { contracts, loading, error, reconnect } = useContracts();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DAO Governance
          </Typography>
          <Button 
            color="inherit" 
            onClick={reconnect}
          >
            {loading ? 'Connecting...' : error ? 'Retry Connect' : contracts ? 'Connected' : 'Connect Wallet'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Token Info" />
            <Tab label="Proposals" />
            <Tab label="Create Proposal" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TokenInfo />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ProposalList />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CreateProposal />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default App;
