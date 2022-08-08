import { useState, useEffect } from "react";
import { db } from "../firabase/sdk";
import { TextInput, Button, Group, Box, createStyles } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import * as campaignActions from "../redux/actions/campaign/campaignActions";
import { Campaign } from "../Models/Models";
import { RootState } from "../redux/store/store";
import NewCampaignForm from "./NewCampaignForm";
import { useNavigate } from "react-router-dom";
import { outerContainerMinHeight } from '../utils/css_variables';

const useStyles = createStyles(() => ({
  outerContainer: {
    width: "100vw",
    height: outerContainerMinHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  mainContainer: {
    width: "300px",
    minHeight: "400px",
  },
  campaignsContainer: {
    marginBottom: "2rem",
  },
  campaign: {
    width: "300px",
  },
  newCampaignInput: {},
  utilBtn: {
    width: "300px",
    marginBottom: "20px",
    marginTop: "20px",
  },
}));

export default function Campaigns() {
  const dispatch = useDispatch();
  const campaignsCollectionRef = collection(db, "Campaigns");
  const campaignsStore = useSelector((state: RootState) => state.campaigns);
  const user = useSelector((state: RootState) => state.user);
  const [newCampaign, setNewCampaign] = useState("");
  const { classes } = useStyles();
  const navigate = useNavigate();

  const getCamapaigns = () => {
    getDocs(campaignsCollectionRef).then((snaphot) => {
      // eslint-disable-next-line
      const campaigns: any[] = [];
      snaphot.docs.forEach((doc) => {
        campaigns.push({ ...doc.data(), id: doc.id });
      });
      dispatch(campaignActions.campaignsDownloaded(campaigns));
    });
  };

  const addCampaign = () => {
    const campaignRef = doc(db, "Campaigns", newCampaign);
  };

  useEffect(() => {
    getCamapaigns();
  }, []);

  return (
    <Box className={classes.outerContainer}>
      <Box className={classes.mainContainer}>
        <h2>Choose campaign</h2>
        <Box className={classes.campaignsContainer}>
          {campaignsStore &&
            campaignsStore.map((campaign) => (
              <Button className={classes.campaign} key={campaign.id} onClick={() => navigate('/essa')}>
                {campaign.name}
              </Button>
            ))}
        </Box>
        {user.role === "MP" && <NewCampaignForm />}
      </Box>
    </Box>
  );
}
