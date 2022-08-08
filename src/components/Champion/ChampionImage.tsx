import React, { useState } from "react";
import { Champion } from "../../Models/Models";
import { Box, Button, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  heroImg: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  container: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
  },
  showBtn: {
    marginBottom: ".5rem",
    width: "140px",
  },
}));

type IProps = {
  champ: Champion;
};

const ChampionImage: React.FC<IProps> = ({ champ }) => {
  const { classes } = useStyles();
  const [openImage, setOpenImage] = useState(false);

  return (
    <Box className={openImage ? classes.container : undefined}>
      <Button
        className={classes.showBtn}
        onClick={() => setOpenImage(!openImage)}
      >
        Show Image
      </Button>
      {openImage && (
        <img className={classes.heroImg} src={champ.img} alt="hero" />
      )}
    </Box>
  );
};

export default ChampionImage;
