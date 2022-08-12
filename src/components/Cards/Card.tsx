import React from "react";
import {
  Text,
  TextInput,
  Button,
  Group,
  Box,
  createStyles,
  Modal,
} from "@mantine/core";

const useStyles = createStyles(() => ({
  outerContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "200px",
    height: "300px",
    border: '1px solid white',
    backgroundImage: 'url("https://images.unsplash.com/photo-1585508889431-a1d0d9c5a324?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80")',
    backgroundSize: '200px 300px',
    position: 'relative',
  },
  circle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    position: 'absolute',
    top: '-25px',
    left: '-25px',
    backgroundColor: 'purple',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
  circleData: {
    marginLeft: '18px',
    marginTop: '18px'
  },
  name: {
    width: '80%',
    color: "black",
    margin: 'auto',
    backgroundColor: 'brown',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    marginTop: '2rem',
    height: '2rem'
  }
}));

const Card: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.outerContainer}>
      <Box className={classes.cardContainer}>
        <Box>
          <Box className={classes.name}>Name</Box>
          <Box></Box>
          <Box></Box>
          <Box></Box>
        </Box>
        <Box className={classes.circle}><Text className={classes.circleData}>0</Text></Box>
        <Box></Box>
      </Box>
    </Box>
  );
};

export default Card;
