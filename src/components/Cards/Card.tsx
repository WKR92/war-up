import {
  Box,
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";

import React from "react";
import { zonnCardsData } from "./cardsData";

const useStyles = createStyles(() => ({

  cardContainer: {
    margin: 'auto',
    height: "auto",
    border: '1px solid #1A1B1E',
    marginBottom: '2rem',
    position: 'relative',
    width: "95%",
    maxWidth: "376px",
  },
  topCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    position: 'absolute',
    top: '-25px',
    left: '-25px',
    backgroundColor: '#003366',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
  topCircleData: {
    marginLeft: '18px',
    marginTop: '18px',
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  bottomCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '-25px',
    right: '-25px',
    backgroundColor: '#570861',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
  bottomCircleData: {
    marginRight: '18px',
    marginBottom: '18px',
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  blackBoxLeft: {
    position: 'absolute',
    width: '50px',
    height: '50px',
    top: '-1px',
    left: '-51px',
    backgroundColor: '#1A1B1E'
  },
  blackBoxTop: {
    position: 'absolute',
    width: '150px',
    height: '25px',
    top: '-26px',
    left: '-31px',
    backgroundColor: '#1A1B1E'
  },
  blackBoxRight: {
    position: 'absolute',
    width: '50px',
    height: '50px',
    bottom: '-1px',
    right: '-51px',
    backgroundColor: '#1A1B1E'
  },
  blackBoxBottom: {
    position: 'absolute',
    width: '150px',
    height: '25px',
    bottom: '-26px',
    right: '-31px',
    backgroundColor: '#1A1B1E'
  },
  name: {
    width: '85%',
    color: "black",
    margin: 'auto',
    backgroundColor: '-webkit-linear-gradient(to right, #334d50, #cbcaa5)',
    backgroundImage: 'linear-gradient(to right, #334d50, #cbcaa5)',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    marginTop: '1rem',
    height: '2.5rem',
    padding: '.25rem',
    border: '1px solid black',
  },
  mainImgContainer: {
    width: '85%',
    margin: 'auto',
    marginTop: '.5rem',
    height: '250px',
    marginBottom: '.5rem',
    border: '1px solid black',
  },
  mainImg: {
    width: '100%',
    height: '100%'
  },
  type: {
    width: '80%',
    margin: 'auto',
    marginTop: '-1.5rem',
    backgroundColor: '-webkit-linear-gradient(to right, #334d50, #cbcaa5)',
    backgroundImage: 'linear-gradient(to right, #334d50, #cbcaa5)',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    color: 'white',
    fontSize: '0.8rem',
    padding: '.5rem',
    border: '1px solid black',
  },
  description: {
    width: '85%',
    margin: 'auto',
    height: '200px',
    backgroundColor: 'white',
    padding: '.75rem',
    marginTop: '-.5rem',
    color: 'black',
    border: '1px solid black',
    marginBottom: '1rem'
  }
}));

const Card: React.FC = () => {
  const { classes } = useStyles();
  const cards = zonnCardsData as Card[];

  return (
    <Box>
      {cards.length > 0 && cards.map(card => (
        <Box className={classes.cardContainer} style={{ backgroundImage: `url(${card.backgroundImg}` }}>
          <Box>
            <Box className={classes.name}>{card.name}</Box>
            <Box className={classes.mainImgContainer}><img className={classes.mainImg} alt='card_main_img' src={card.mainImg} /></Box>
            <Box className={classes.type} style={{ position: 'relative', zIndex: 100 }}>{card.type}</Box>
            <Box className={classes.description}>
              <Text>{card.description1}</Text>
              {card.description2 && <Text>{card.description2}</Text>}
            </Box>
          </Box>
          <Box className={classes.topCircle}><Text className={classes.topCircleData}>{card.cost}</Text></Box>
          <Box className={classes.blackBoxLeft}></Box>
          <Box className={classes.blackBoxTop}></Box>
          <Box className={classes.blackBoxRight} style={{ zIndex: 100 }}></Box>
          <Box className={classes.blackBoxBottom} style={{ zIndex: 100 }}></Box>
          <Box className={classes.bottomCircle}><Text className={classes.bottomCircleData}>{card.cooldown}</Text></Box>
        </Box>
      ))}
    </Box>
  );
};

export default Card;

type Card = {
  name: string;
  mainImg: string;
  type: string;
  description1: string;
  description2?: string;
  cost: string;
  cooldown: string;
  backgroundImg: string;
}