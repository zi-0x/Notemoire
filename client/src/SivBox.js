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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isComposing, setIsComposing] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Enter to submit
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (showPollForm) {
          handlePollSubmit();
        } else if (sivMessage.trim()) {
          handleSivSubmit();
        }
      }
      const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

const uploadFileToCloudinary = async () => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your real one
  setUploading(true);
  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload", formData);
    return res.data.secure_url;
  } catch (err) {
    console.error("Upload failed", err);
    alert("Upload failed!");
    return "";
  } finally {
    setUploading(false);
  }
};

      // Escape to close poll form
      if (event.key === 'Escape' && showPollForm) {
        setShowPollForm(false);
        setPollQuestion("");
        setPollOptions(["", ""]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sivMessage, showPollForm, pollQuestion, pollOptions]);

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

  const handleSivSubmit = async () => {
  if (!sivMessage.trim() && !selectedFile) return;

  setIsComposing(true);
  try {
    let fileUrl = "";

    if (selectedFile) {
      fileUrl = await uploadFileToCloudinary();
    }

    const completeMessage = sivMessage + (fileUrl ? `\n📎 ${fileUrl}` : "");

    await addSiv(completeMessage);
    setSivMessage("");
    setSelectedFile(null);
    alert("✅ Siv posted successfully!");
  } catch (error) {
    alert("❌ Error posting Siv.");
  } finally {
    setIsComposing(false);
  }
};


  const addPoll = async () => {
    // Create a poll object with question and options
    const pollData = {
      type: 'poll',
      id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: pollQuestion,
      options: pollOptions.filter(option => option.trim() !== ''),
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
      // Store poll data as JSON string in sivText
      let pollTx = await socivaContract.addSiv(JSON.stringify(pollData), false);
      console.log('Poll created:', pollTx);
    } catch (error) {
      console.log("Error submitting new Poll:", error);
    }
  };

  const handlePollSubmit = async () => {
    if (!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2) {
      alert("Please enter a question and at least 2 options for your poll.");
      return;
    }
    
    setIsComposing(true);
    try {
      await addPoll();
      // Reset form
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

  const sendSiv = async (e) => {
    e.preventDefault();
    try {
      await addSiv();
      setSivMessage("");
    } catch (error) {
      console.error("Error sending siv:", error);
    }
  };

  const sendPoll = async (e) => {
    e.preventDefault();
    try {
      await addPoll();
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPollForm(false);
    } catch (error) {
      console.error("Error sending poll:", error);
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
    // Use a random name or user input for avatar
    setAvatarName("NoteMoire User");
  }, []);

const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

const uploadFileToCloudinary = async () => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your actual preset
  setUploading(true);
  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload", // Replace with your Cloud name
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
          <Avatar name={avatarName} size="50" round={true} color="#bb2b7a" fgColor="#ffffff" />
          <input
            onChange={(e) => setSivMessage(e.target.value)}
            value={sivMessage}
            placeholder="What's happening?"
            type="text"
            style={{ borderRadius: '50px' }}
          />
        </div>

{selectedFile && (
  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "0.5rem" }}>
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
      <label htmlFor="fileInput" className="attach-file">Attach a file</label>
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
                  disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2 || isComposing}
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