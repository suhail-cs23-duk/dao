import { useState } from "react";
import * as React from "react";
import { useContracts } from './web3/useContracts';
import TokenInfo from './components/TokenInfo';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';
import AdminPanel from './components/AdminPanel';
import CertificateList from './components/CertificateList';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

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
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const { contracts, loading, error, reconnect } = useContracts();
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AppBar position="static" elevation={0}>
          <Container maxWidth="md">
            <Toolbar 
              disableGutters 
              sx={{ 
                px: { xs: 1, sm: 2 }
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                DAO Governance
              </Typography>
              <Button 
                color="inherit" 
                onClick={reconnect}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                {loading ? 'Connecting...' : error ? 'Retry Connect' : contracts ? 'Connected' : 'Connect Wallet'}
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Container 
          maxWidth="md" 
          sx={{ 
            mt: { xs: 2, sm: 3, md: 4 }, 
            mb: { xs: 2, sm: 3, md: 4 }, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 1, sm: 2 }
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: { xs: 1, sm: 2 },
              overflow: 'hidden',
              bgcolor: 'background.paper',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                sx={{
                  px: { xs: 1, sm: 2 },
                  bgcolor: 'background.paper',
                  '& .MuiTab-root': {
                    minHeight: { xs: 48, sm: 64 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    minWidth: isMobile ? 'auto' : isTablet ? 120 : 160
                  }
                }}
              >
                <Tab label="Token Info" />
                <Tab label="Proposals" />
                <Tab label="Create Proposal" />
                <Tab label="Admin Panel" />
                <Tab label="Certificates" />
              </Tabs>
            </Box>

            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                margin: '0 auto',
                width: '100%'
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <TokenInfo />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ProposalList />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <CreateProposal />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <AdminPanel />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <CertificateList />
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
