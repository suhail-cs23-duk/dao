import { useState } from "react";
import * as React from "react";
import { id, Interface, Contract, BrowserProvider } from "ethers";

import {
  CertAddr,
  MyGovernorAddr,
} from "./contract-data/deployedAddresses.json";
import { abi as Govabi } from "./contract-data/MyGovernor.json";
import { abi as Certabi } from "./contract-data/Cert.json";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Chip from "@mui/material/Chip";

import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function App() {
  const [loginState, setLoginState] = useState("Connect");
  const [proposals, setProposals] = useState([
    ['No Prosposals', '']
  ]);
  const [pDescription, setPDescription] = useState('');

  const provider = new BrowserProvider(window.ethereum);
  console.log("Provider:", provider);

  const handleSubmit = async (event) => {
    const signer = await provider.getSigner();
    const Govinstance = new Contract(MyGovernorAddr, Govabi, signer);
    const Certinstance = new Contract(CertAddr, Certabi, signer);

    let paramsArray = [104, "An", "EDP", "A", "25th June"];

    const transferCalldata = Certinstance.interface.encodeFunctionData(
      "issue",
      paramsArray
    );

    try {
      // Propose the transaction
      const proposeTx = await Govinstance.propose(
        [CertAddr],
        [0],
        [transferCalldata],
        pDescription
      );
      await proposeTx.wait();
      console.log("Proposal transaction successful:", proposeTx.hash);
      getEvents();
      handleClose();
    } catch (error) {
      console.error("Error proposing transaction:", error);
    }
  };

  const getEvents = async (event) => {
    let eventlogs = [];

    const signer = await provider.getSigner();
    const Govinstance = new Contract(MyGovernorAddr, Govabi, signer);

    const filter = Govinstance.filters.ProposalCreated();
    const events = await Govinstance.queryFilter(filter);
    console.log("ProposalCreated events:", events);

    events.forEach((event) => {
      eventlogs.push([event.args[0].toString(), event.args[8]]);
    });
    setProposals(eventlogs);
    console.log(eventlogs);
  };

  async function connectMetaMask() {
    const signer = await provider.getSigner();
    alert(`Successfully Connected ${signer.address}`);
    setLoginState("Connected");
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePDesChange = (event) => {
    setPDescription(event.target.value);
  };

  return (
    <>
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
              DAO: Certi App
            </Typography>
            <Button color="inherit" onClick={connectMetaMask}>
              <b>{loginState}</b>
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <br></br>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Proposal
      </Button>
      <Button
        style={{ marginLeft: "5px" }}
        variant="outlined"
        onClick={getEvents}
      >
        Events
      </Button>
      <h2>Active Proposals</h2>
      <div
        style={{
          border: "2px solid blue",
          padding: "10px",
          borderRadius: "25px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {proposals.map((proposal, index) => (
              <Grid item xs={2} sm={4} md={4}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography component="div" paragraph style={{ wordWrap: 'break-word' }}>
                      <b>Proposal ID: </b>
                      {proposal[0]}
                    </Typography>

                    <Typography variant="body2">{proposal[1]}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained">Active</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

      <h2>All Proposals</h2>
      <div
        style={{
          border: "2px solid blue",
          padding: "10px",
          borderRadius: "25px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography>
                <b>Proposal ID: </b>
                40113249118907347497846265566344225737199931284307161947685216366528597413334
              </Typography>
              <Chip label="Success" color="primary" />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Proposal #1: Issue certificate 101</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography>
                <b>Proposal ID: </b>
                40113249118907347497846265566344225737199931284307161947685216366528597413334
              </Typography>
              <Chip label="Success" color="primary" />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Proposal #2: Issue certificate 102</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography>
                <b>Proposal ID: </b>
                40113249118907347497846265566344225737199931284307161947685216366528597413334
              </Typography>
              <Chip label="Success" color="primary" />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Proposal #3: Issue certificate 104</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography>
                <b>Proposal ID: </b>
                40113249118907347497846265566344225737199931284307161947685216366528597413334
              </Typography>
              <Chip label="Success" color="primary" />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Proposal #4: Issue certificate 104</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle>New Proposal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the details for a new proposal
            </DialogContentText>
            <br />
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value="Function to Execute"
              // onChange={handleChange}
            >
              <MenuItem value="Function to Execute">
                Function to Execute
              </MenuItem>
              <MenuItem value="issue">issue</MenuItem>
            </Select>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Details of the Function to Execute"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Address of the contract"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Description"
              type="email"
              fullWidth
              variant="standard"
              onChange={handlePDesChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}

export default App;