import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Collapse,
  Box,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { XStateUpdate } from 'src/renderer/src/stateManagement/zustand/store.types';
import ReactJson from 'react-json-view';


const StateTransitionItem: React.FC<{ item: XStateUpdate }> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const [showContext, setShowContext] = React.useState(false);
  const [showOutput, setShowOutput] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const { snapshot, timestamp } = item;
  const { value, context, status } = snapshot;

  const handleClick = () => {
    setOpen(!open);
  };

  let icon = <ArrowForwardIcon color="action" />;
  if (status === 'done') {
    icon = <CheckCircleIcon color="success" />;
  } else if (value === 'failure') {
    icon = <ErrorIcon color="error" />;
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={`State: ${JSON.stringify(value)}`}
            secondary={`Status: ${status} at ${new Date(timestamp).toLocaleTimeString()}`}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: 4,
            mr: 2,
            maxHeight: '400px', // Adjust the max height as needed
            overflow: 'auto',
          }}
        >
          <Typography
            variant="subtitle1"
            onClick={() => setShowContext(!showContext)}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            Context {showContext ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Typography>
          {showContext && (
            <Box sx={{ overflowX: 'auto' }}>
              <ReactJson src={context} collapsed={1} />
            </Box>
          )}
          {snapshot.output && (
            <>
              <Typography
                variant="subtitle1"
                onClick={() => setShowOutput(!showOutput)}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                Output {showOutput ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Typography>
              {showOutput && (
                <Box sx={{ overflowX: 'auto' }}>
                  <pre>{JSON.stringify(snapshot.output, null, 2)}</pre>
                </Box>
              )}
            </>
          )}
          {snapshot.error && (
            <>
              <Typography
                variant="subtitle1"
                onClick={() => setShowError(!showError)}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                Error {showError ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Typography>
              {showError && (
                <Box sx={{ overflowX: 'auto' }}>
                  <pre>{JSON.stringify(snapshot.error, null, 2)}</pre>
                </Box>
              )}
            </>
          )}
          <Typography variant="subtitle1">Status:</Typography>
          <Typography variant="body2">{status}</Typography>
        </Paper>
      </Collapse>
    </>
  );
};

export default StateTransitionItem;
