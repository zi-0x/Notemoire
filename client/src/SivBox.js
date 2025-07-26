import React, { useState, useEffect, useCallback } from "react";
import Sociva from "./utils/socivaContract.json";
import "./SivBox.css";
import Avatar from "react-avatar";
import { Button } from "@mui/material";

import { SocivaContractAddress } from "./config.js";
import { BrowserProvider, Contract } from "ethers";

import { createStorachaClient } from "./w3client.js"; // Note: This now returns Pinata client

function SivBox({ onPost, refreshFeed }) {
  const [sivMessage, setSivMessage] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isComposing, setIsComposing] = useState(false);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
    const desc = params.get("desc");

    if (title || desc) {
      const formatted = `Title: ${title || ""}\nDescription: ${desc || ""}`;
      setSivMessage(formatted);
    }
  }, []);

  // Store Siv on blockchain - Updated to accept CID parameter
  const addSiv = useCallback(async (text, cid = null) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const socivaContract = new Contract(
        SocivaContractAddress,
        Sociva.abi,
        signer
      );

      // Store the complete message (with IPFS link embedded)
      const tx = await socivaContract.addSiv(text, false);
      await tx.wait();
      console.log("✅ Siv stored on-chain:", tx.hash);

      // Log the CID for reference
      if (cid) {
        console.log("📁 IPFS CID:", cid);
      }
    } catch (error) {
      console.log("Error submitting new Siv:", error);
      throw error;
    }
  }, []); // No dependencies needed for this function

   
  const addPoll = useCallback(async () => {
    const pollData = {
      type: "poll",
      id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: pollQuestion,
      options: pollOptions.filter((option) => option.trim() !== ""),
      votes: {},
      sivText: `Poll: ${pollQuestion}`,
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

      // Pass two parameters to match your deployed contract
      const tx = await socivaContract.addSiv(JSON.stringify(pollData), false);
      await tx.wait();
      console.log("✅ Poll created:", tx.hash);

      // Call refresh functions after successful poll creation
      if (refreshFeed) refreshFeed();
      if (onPost) onPost();
    } catch (error) {
      console.log("Error submitting new Poll:", error);
      throw error;
    }
  }, [pollQuestion, pollOptions, refreshFeed, onPost]); // Add all dependencies

 
  const handleSivSubmit = useCallback(async () => {
    if (!sivMessage.trim() && !selectedFile) {
      alert("Please enter a message or select a file.");
      return;
    }

    setIsComposing(true);
    try {
      let messageToSend = sivMessage.trim() || "File upload";
      let cid = null;

      // Try Pinata IPFS upload for messages and files
      try {
        console.log("Attempting Pinata IPFS upload...");
        const client = await createStorachaClient();

        if (selectedFile) {
          console.log(
            "Uploading file to IPFS:",
            selectedFile.name,
            selectedFile.type
          );

          // Upload file to IPFS
          cid = await client.uploadFileWrapper(selectedFile);

          
          const fileInfo =
            selectedFile.type === "application/pdf" ? "📄" : "📎";
          messageToSend = sivMessage.trim()
            ? `${sivMessage}\n${fileInfo} ${selectedFile.name}\n🔗 IPFS: ${cid}`
            : `${fileInfo} ${selectedFile.name}\n🔗 IPFS: ${cid}`;

          console.log("✅ File uploaded to IPFS with CID:", cid);
        } else {
          // Upload text to IPFS
          cid = await client.uploadText(messageToSend);
          messageToSend = `${sivMessage}\n🔗 IPFS: ${cid}`;
          console.log("✅ Text uploaded to IPFS with CID:", cid);
        }

        // Store the message with embedded IPFS link
        await addSiv(messageToSend);
      } catch (pinataError) {
        console.error(
          "Pinata IPFS upload failed, posting directly:",
          pinataError
        );

        // If IPFS upload fails, still post the message (without IPFS link)
        if (selectedFile) {
          alert("⚠️ IPFS upload failed. File cannot be shared without IPFS.");
          return;
        } else {
          await addSiv(messageToSend); // Post text without IPFS
        }
      }

      // Clear form
      setSivMessage("");
      setSelectedFile(null);
      alert("✅ Siv posted successfully!");

      // Call refresh functions after successful post
      if (onPost) onPost();
      if (refreshFeed) refreshFeed();
    } catch (error) {
      console.error("Error posting Siv:", error);
      alert("❌ Error posting Siv. Check console for details.");
    } finally {
      setIsComposing(false);
    }
  }, [sivMessage, selectedFile, onPost, refreshFeed, addSiv]); // Add addSiv dependency

  //Add addPoll to handlePollSubmit dependencies
  const handlePollSubmit = useCallback(async () => {
    if (
      !pollQuestion.trim() ||
      pollOptions.filter((opt) => opt.trim()).length < 2
    ) {
      alert("Please enter a question and at least 2 options for your poll.");
      return;
    }
    setIsComposing(true);
    try {
      await addPoll();
      setShowPollForm(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      alert("✅ Poll created successfully!");
    } catch (error) {
      alert("❌ Error creating poll. Please try again.");
    } finally {
      setIsComposing(false);
    }
  }, [pollQuestion, pollOptions, addPoll]); // Add addPoll dependency

  // Add handleSivSubmit and handlePollSubmit to useEffect dependencies
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        if (showPollForm) {
          handlePollSubmit();
        } else if (sivMessage.trim() || selectedFile) {
          handleSivSubmit();
        }
      }
      if (event.key === "Escape" && showPollForm) {
        setShowPollForm(false);
        setPollQuestion("");
        setPollOptions(["", ""]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    sivMessage,
    showPollForm,
    pollQuestion,
    pollOptions,
    selectedFile,
    handlePollSubmit,
    handleSivSubmit,
  ]);

  const togglePollForm = () => {
    setShowPollForm(!showPollForm);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  useEffect(() => {
    setAvatarName("");
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name, file.type);
    }
  };

  return (
    <div className="sivBox">
      <form>
        <div className="sivBox__input">
          <Avatar
            name={avatarName}
            size="50"
            round={true}
            color="#bb2b7a"
            fgColor="#ffffff"
          />
          <input
            onChange={(e) => setSivMessage(e.target.value)}
            value={sivMessage}
            placeholder={
              selectedFile ? `File: ${selectedFile.name}` : "What's happening?"
            }
            type="text"
            style={{ borderRadius: "50px" }}
          />
        </div>

        {selectedFile && (
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginTop: "0.5rem",
              padding: "8px",
              backgroundColor: "var(--background-secondary)",
              borderRadius: "8px",
            }}
          >
            <span style={{ marginRight: "8px" }}>
              {selectedFile.type === "application/pdf" ? "📄" : "📎"}
            </span>
            Selected: <strong>{selectedFile.name}</strong>
            <br />
            <small>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</small>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              style={{
                marginLeft: "10px",
                background: "none",
                border: "none",
                color: "#bb2b7a",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {isComposing && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            🚀 Uploading to IPFS & Blockchain... Please confirm MetaMask
          </p>
        )}

        {!showPollForm ? (
          <div className="sivBox__buttons">
            <Button
              onClick={handleSivSubmit}
              type="button"
              disabled={(!sivMessage.trim() && !selectedFile) || isComposing}
              className="sivBox__sivButton"
            >
              {isComposing ? "Posting..." : "Siv"}
            </Button>
            <Button
              onClick={togglePollForm}
              type="button"
              className="sivBox__addPoll"
            >
              Add Poll
            </Button>
            <label htmlFor="fileInput" className="attach-file">
              {selectedFile ? "Change File" : "Attach File"}
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*,video/*,.pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="sivBox__pollForm">
            <input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="sivBox__pollQuestion"
            />

            {pollOptions.map((option, index) => (
              <div key={index} className="sivBox__pollOption">
                <input
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="sivBox__pollOptionInput"
                />
                {pollOptions.length > 2 && (
                  <Button
                    onClick={() => removePollOption(index)}
                    className="sivBox__removeOption"
                    size="small"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}

            <div className="sivBox__pollActions">
              <Button
                onClick={addPollOption}
                className="sivBox__addOption"
                size="small"
              >
                Add Option
              </Button>

              <div className="sivBox__pollButtons">
                <Button
                  onClick={() => {
                    setShowPollForm(false);
                    setPollQuestion("");
                    setPollOptions(["", ""]);
                  }}
                  className="sivBox__cancelPoll"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePollSubmit}
                  disabled={
                    !pollQuestion.trim() ||
                    pollOptions.filter((opt) => opt.trim()).length < 2 ||
                    isComposing
                  }
                  className="sivBox__submitPoll"
                >
                  {isComposing ? "Creating..." : "Create Poll"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SivBox;
