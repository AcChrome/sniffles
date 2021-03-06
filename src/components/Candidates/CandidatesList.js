import React, { useEffect, useState } from "react";
import Candidate from "./Candidate";
import "./CandidatesList.css";
import axios from "axios";
import BathDog from "../home-svg/BathDog"
import { withRouter } from "react-router-dom";

// TO DO: add rendering page
const CandidateList = (profile) => {
  const profileId = profile.profile[0].id;
  const [profiles, setProfiles] = useState([]);
  const [swiped, setSwiped] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
      let timer1 = setTimeout(() => setShow(true), 1.5 * 1000);
      return () => {
        clearTimeout(timer1);
      };
  }, []);

  useEffect(() => {
    if (profiles.length === 0) {
      // get all profiles except current user's
      axios.get(`/api/profiles/${profileId}`).then((res) => {
        const profiles = res.data;
        setProfiles([...profiles]);
      });
    }
    if (swiped.length === 0) {
      // get all candidates ids the current user has swiped
      axios.get(`/api/candidate/${profileId}`).then((res) => {
        const profiles = res.data;
        setSwiped([...profiles]);
      });
    }
  }, []);

  // remove profiles that the user swiped before
  swiped.forEach((swipee) => {
    const i = profiles.findIndex(
      (profile) => parseInt(profile.id) === parseInt(swipee.candidate_dog_id)
    );
    if (i !== -1) {
      profiles.splice(i, 1);
    }
  });

  const candidateListItem = profiles.map((candidate) => {
    return (
      <Candidate
        key={candidate.id}
        candidate_id={candidate.id}
        name={candidate.name}
        imageUrl={candidate.imageurl}
        location={candidate.location}
        info={candidate.description}
        breed={candidate.breed}
        gender={candidate.gender}
        age={candidate.age}
        size={candidate.size}
        owner={candidate.owner}
        user_id={profileId}
        user={profile.profile[0]}
      />
    );
  });

  return show ? (
    <div className="candidate">
      <div className="candidate_card" id="candidate_cardNone" style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5b631cba5b409b413bb3a633/1537968401007-7CNIR58SO7FN3OEU4TIE/daniel-brunsteiner-1055275-unsplash.jpg?format=1500w')` }}>
        <div className="candidate_none">
          <div className="candidate_none_text">
          <h1>Take a break,</h1>
          <h1>drink some water,</h1>
          <h1>and come back later!</h1>
          </div>
        </div>
      </div>
      {candidateListItem}
    </div>
  ) : (
    <div className="container">
      <h1>Loading...</h1>
      <br/>    
    <div className="progress progress-striped">
      <div className="progress-bar">
      </div>                       
    </div> 
  </div>
  );
};

export default withRouter(CandidateList);
