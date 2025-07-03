import React, { useState, useEffect } from "react";
import Sociva from "./utils/socivaContract.json";
import "./SivBox.css";
import Avatar from "react-avatar";
import { Button } from "@mui/material";
import axios from "axios";
import { SocivaContractAddress } from "./config.js";
import { BrowserProvider, Contract } from "ethers";

function SivBox() {
  const [sivMessage, setSivMessage] = useState("");
  const [avatarName, setAvatarName] = useState("");

  const addSiv = async () => {
    let siv = {
      sivText: sivMessage,
      isDeleted: false,
    };

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const socivaContract = new Contract(
        SocivaContractAddress,
        Sociva.abi,
        signer
      );
      let sivTx = await socivaContract.addSiv(siv.sivText, siv?.isDeleted);
      console.log(sivTx);
    } catch (error) {
      console.log("Error submitting new Siv:", error);
    }
  };

  const sendSiv = async (e) => {
    e.preventDefault();
    try {
      await addSiv();
      setSivMessage("");
    } catch (error) {
      console.error("Error sending siv:", error);
    }
  };

  const vote = async (e) => {
    e.preventDefault();
    window.location.href = "https://votingfeature.vercel.app/";
  };

  useEffect(() => {
    // Use a random name or user input for avatar
    setAvatarName("Sociva User");
  }, []);

  return (
    <div className="sivBox">
      <form>
        <div className="sivBox__input">
          <Avatar name={avatarName} size="100" round={true} />
          <input
            onChange={(e) => setSivMessage(e.target.value)}
            value={sivMessage}
            placeholder="What's happening?"
            type="text"
            style={{ borderRadius: '50px' }}
          />
        </div>
        <Button
          onClick={sendSiv}
          type="submit"
          className="sivBox__sivButton"
        >
          Siv
        </Button>
        <Button
          onClick={vote}
          type="submit"
          className="sivBox__addVote"
        >
          Add Poll
        </Button>
      </form>
    </div>
  );
}

export default SivBox;