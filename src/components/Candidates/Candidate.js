import React, { useEffect, useState } from "react";
import "./Candidate.css";

// Import component for swipe effect

import DogCard from "react-tinder-card";

// Import components from material-ui
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import LoyaltyOutlinedIcon from "@material-ui/icons/LoyaltyOutlined";
import IconButton from "@material-ui/core/IconButton";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Fab from "@material-ui/core/Fab";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

//key, id, name, imageUrl, location, info
export default function Candidate(props) {
  const { candidate_id, name, imageUrl, location, info, breed, gender, age, size, owner, user_id, user } = props;

  const reject = () => {
    console.log("info: no button");
  };

  const like = () => {
    console.log("info: like button");
  };

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [approve, setApprove] = useState("");

  // OnClick function used to open dialog component
  const handleClickOpen = (candidate, candidateName) => {
    setOpen(true);
    console.log('clicked open');
  };

  // OnClick function used to close dialog component
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  useEffect(() => {
    if (approve !== ""){
      let like = false;
      if (approve === "true"){
        like = true;
      }
      const candidate = { approve: like, profile_id: user_id, candidate_dog_id: candidate_id };
      axios.post(`/api/candidate`, {candidate})
        .then((res) => {
          console.log("candidate created, res:", res);
          // check if its a match, if its a match, create a chat room
          const candidates = res.data;
          console.log('after post, returned candidate:', candidate);
          if (candidates.length === 2 && candidates[0].approve === true && candidates[1].approve === true) {
            let candidate = {};
            // check which candidate is created last
            if (candidates[0].updatedat > candidates[1].updatedat) {
              candidate = candidates[0];
            } else {
              candidate = candidates[1];
            }
            // alert(`You matched with ${name}`);
            setOpenAlert(true);
            console.log('candidate matched, before creating chatroom');
            const room = { profile1_id: user_id, profile2_id: candidate_id, messages: [{user: user.name, text: "Woof, I just matched with you!"}]}
            axios.post(`/api/chatroom`, {room})
              .then(() => console.log('chatroom created'))
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    }
  }, [approve]);

  // create candidate on swipe
  const onSwipe = (direction) => {
    if (direction === "right") {
      console.log("right for ya");
      setApprove("true");
    }
    if (direction === "left") {
      console.log("left for na");
      setApprove("false");
    }
  };

  return (
    <>
      <DogCard
        className="swipe"
        key={name}
        preventSwipe={["up", "down"]}
        onSwipe={onSwipe}
      >
        <div
          style={{ backgroundImage: `url(${imageUrl})` }}
          className="candidate_card"
        >
          <div className="candidate_info">
            <Fab
              variant="extended"
              disabled
              aria-label="like"
              style={{ fontSize: 20 }}
            >
              <h1 className="candidate_name">{name}</h1>
            </Fab>
            <h3>
              <LocationOnIcon className="location" />
              {location}
            </h3>
            <h3>
              <BookmarkIcon />
              {info}
            </h3>
          </div>

          <div className="button">
            <IconButton size="small" onClick={reject}>
              <NotInterestedIcon
                className="button_notInterested"
                style={{ fontSize: 65 }}
              />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => handleClickOpen(name, name)}
            >
              <InfoOutlinedIcon
                className="button_moreInfo"
                style={{ fontSize: 65 }}
              />
            </IconButton>

            <IconButton size="small" onClick={like}>
              <LoyaltyOutlinedIcon
                className="button_loyalty"
                style={{ fontSize: 65 }}
              />
            </IconButton>
          </div>
        </div>
      </DogCard>

      <Dialog
        open={open}
        onClose={handleClose}
        // aria-labelledby="form-dialog-title"
      >
        <DialogContent className="candidate_dialog">
          <h2>{name}</h2>
          <br />

          <p>Location: {location}</p>
          <p>Breed: {breed}</p>
          <p>Gender: {gender}</p>
          <p>Age: {age}</p>
          <p>Size: {size}</p>
          <p>Owner: {owner}</p>
          <br />
        </DialogContent>
      </Dialog>

      <Snackbar anchorOrigin={{ vertical: 'center', horizontal: 'center' }} open={openAlert} autoHideDuration={8000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" variant="filled">
          You matched with {name}
        </Alert>
      </Snackbar>
    </>
  );
}
