import React, { useState, useEffect } from "react";
import Sociva from "./utils/socivaContract.json";
import "./SivBox.css";
import Avatar from "react-avatar";
import { Button } from "@mui/material";
import axios from "axios";
import { SocivaContractAddress } from "./config.js";
import { BrowserProvider, Contract } from "ethers";
import { registerNote } from "./blockchain.js";
import { createStorachaClient } from "./w3client.js"; // Note: This now returns Pinata client

function SivBox() {
  const [sivMessage, setSivMessage] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isComposing, setIsComposing] = useState(false);
  const [prefill, setPrefill] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
    const desc = params.get("desc");

    if (title || desc) {
      const formatted = `Title: ${title || ""}\nDescription: ${desc || ""}`;
      setPrefill(formatted);
      setSivMessage(formatted);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        if (showPollForm) {
          handlePollSubmit();
        } else if (sivMessage.trim()) {
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
  }, [sivMessage, showPollForm, pollQuestion, pollOptions]);

  // IPFS upload via Pinata for ALL messages and files
  // In SivBox.js, update handleSivSubmit:
  const handleSivSubmit = async () => {
    if (!sivMessage.trim() && !selectedFile) {
      alert("Please enter a message or select a file.");
      return;
    }

    setIsComposing(true);
    try {
      let messageToSend = sivMessage.trim();

      // Try Pinata IPFS upload for ALL messages
      if (messageToSend || selectedFile) {
        try {
          console.log("Attempting Pinata IPFS upload...");
          const client = await createStorachaClient();

          let cid;
          if (selectedFile) {
            cid = await client.uploadFileWrapper(selectedFile);
          } else {
            cid = await client.uploadText(messageToSend);
          }

          console.log("✅ Uploaded to IPFS via Pinata with CID:", cid);

          // Include the CID in the message for clickable links
          messageToSend = `${sivMessage}\n🔗 IPFS: ${cid}`;

          // Store the message with embedded IPFS link
          await addSiv(messageToSend);
        } catch (pinataError) {
          console.error(
            "Pinata IPFS upload failed, posting text directly:",
            pinataError
          );
          await addSiv(messageToSend); // No CID if upload fails
        }
      } else {
        await addSiv(messageToSend);
      }

      // Clear form
      setSivMessage("");
      setSelectedFile(null);
      alert("✅ Siv posted successfully!");
    } catch (error) {
      console.error("Error posting Siv:", error);
      alert("❌ Error posting Siv. Check console for details.");
    } finally {
      setIsComposing(false);
    }
  };

  // Store Siv on blockchain - Updated to accept CID parameter
  const addSiv = async (text, cid = null) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const socivaContract = new Contract(
        SocivaContractAddress,
        Sociva.abi,
        signer
      );

      // If you want to store the CID in the blockchain text, uncomment this:
      // const textToStore = cid ? `${text}\n🔗 IPFS: ${cid}` : text;

      // For now, just store the original text (CID is passed but not used)
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
  };

  // Store poll on blockchain
  const addPoll = async () => {
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
    } catch (error) {
      console.log("Error submitting new Poll:", error);
      throw error;
    }
  };

  const handlePollSubmit = async () => {
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
  };

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
    setSelectedFile(e.target.files[0]);
  };

  // Alternative file upload via Cloudinary (if you prefer over IPFS)
  const uploadFileToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "your_upload_preset");
    setUploading(true);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload",
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed!");
      return "";
    } finally {
      setUploading(false);
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
            placeholder="What's happening?"
            type="text"
            style={{ borderRadius: "50px" }}
          />
        </div>

        {selectedFile && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            Selected: {selectedFile.name}
          </p>
        )}

        {uploading && (
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
            Uploading file...
          </p>
        )}

        {!showPollForm ? (
          <div className="sivBox__buttons">
            <Button
              onClick={handleSivSubmit}
              type="button"
              disabled={!sivMessage.trim() || isComposing}
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
            {!selectedFile ? (
              <>
                <label htmlFor="fileInput" className="attach-file">
                  Attach a file
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <button
                className="sivBox__attachButton"
                onClick={uploadFileToCloudinary}
                disabled={uploading}
              >
                {uploading ? "Posting..." : "Post File"}
              </button>
            )}
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
