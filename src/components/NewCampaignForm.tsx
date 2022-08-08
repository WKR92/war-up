import { useState } from "react";
import { TextInput, Button, Group, Box, createStyles } from "@mantine/core";
import { useForm } from "@mantine/form";

const useStyles = createStyles(() => ({
  utilBtn: {
    width: "300px",
    marginBottom: "20px",
    marginTop: "20px",
  },
  newCampaignInput: {
    marginBottom: "10px",
    marginTop: "10px",
  },
}));

export default function NewCampaignForm() {
  const [showAddNewCampaignForm, setShowAddNewCampaignForm] = useState(false);
  const { classes } = useStyles();
  const [players, setPlayers] = useState([]);

  const form = useForm({
    initialValues: { name: "", players: [] },
  });

  const playerInput = (
    <TextInput
      key='1'
      required
      label="Player"
      placeholder="player's name"
      {...form.getInputProps("players")}
      className={classes.newCampaignInput}
    />
  );

  return (
    <>
      <Button
        color="violet"
        className={classes.utilBtn}
        onClick={() => setShowAddNewCampaignForm(!showAddNewCampaignForm)}
      >
        {showAddNewCampaignForm ? "Hide" : "Create new campaign"}
      </Button>
      {showAddNewCampaignForm && (
        <form>
          <TextInput
            required
            label="Name"
            placeholder="campaign's name"
            {...form.getInputProps("name")}
            className={classes.newCampaignInput}
          />
          {players.length > 0 && players.map((player) => playerInput)}
          <Button
            color="cyan"
            size="xs"

          >
            Add another player
          </Button>

          <Button color="violet" className={classes.utilBtn} type="submit">
            Add campaign
          </Button>
        </form>
      )}
    </>
  );
}
