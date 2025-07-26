import React, { forwardRef, useState, useEffect } from "react";
import "./Post.css";
import Avatar from "react-avatar";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import Poll from "./Poll";
import IPFSModal from "./IPFSModal"; // Import the modal we created earlier

const Post = forwardRef(
  ({ displayName, text, personal, onClick, cid }, ref) => {
    const [votedPolls, setVotedPolls] = useState(new Set());
    const [pollData, setPollData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(
      Math.floor(Math.random() * 50)
    );
    const [commentCount, setCommentCount] = useState(
      Math.floor(Math.random() * 30)
    );
    const [shareCount, setShareCount] = useState(
      Math.floor(Math.random() * 20)
    );

    // IPFS Modal state
    const [showIPFSModal, setShowIPFSModal] = useState(false);
    const [selectedCID, setSelectedCID] = useState(null);

    // Extract CID from embedded IPFS link in text
    // Fix the CID extraction in Post.js
    const extractCIDFromText = (text) => {
      // Look for the IPFS link pattern and extract the CID
      const ipfsMatch = text.match(/🔗\s*IPFS:\s*([a-zA-Z0-9]{46,})/);
      return ipfsMatch ? ipfsMatch[1] : null;
    };

    // Render text with clickable IPFS links
    const renderTextWithIPFSLinks = (text) => {
      const ipfsRegex = /(🔗\s*IPFS:\s*)([a-zA-Z0-9]+)/g;
      const parts = text.split(ipfsRegex);

      return parts.map((part, index) => {
        // Check if this part is a CID (follows the IPFS: pattern)
        if (ipfsRegex.test(`🔗 IPFS: ${part}`) && /^[a-zA-Z0-9]+$/.test(part)) {
          return (
            <span
              key={index}
              className="ipfs-link"
              onClick={() => handleIPFSClick(part)}
              style={{ cursor: "pointer" }}
            >
              🔗 IPFS: {part.substring(0, 8)}...
            </span>
          );
        }
        // Check if this is the "🔗 IPFS: " prefix
        else if (part.match(/🔗\s*IPFS:\s*/)) {
          return null; // Don't render the prefix separately
        }
        return part;
      });
    };

    const handleIPFSClick = (cidFromText) => {
      const cidToUse = cidFromText || cid || extractCIDFromText(text);

      // Validate the CID before opening modal
      if (cidToUse && isValidCID(cidToUse)) {
        console.log("Opening IPFS modal for CID:", cidToUse);
        setSelectedCID(cidToUse);
        setShowIPFSModal(true);
      } else {
        console.error("Invalid CID:", cidToUse);
        alert("❌ Invalid IPFS link");
      }
    };

    // ... rest of your existing functions (handleVote, handleLike, etc.)

    const isPoll = () => {
      try {
        const parsed = JSON.parse(text);
        return parsed.type === "poll";
      } catch (e) {
        return false;
      }
    };

    const getPollData = () => {
      try {
        const parsed = JSON.parse(text);
        return pollData || parsed;
      } catch (e) {
        return null;
      }
    };

    useEffect(() => {
      if (isPoll()) {
        try {
          const parsed = JSON.parse(text);
          setPollData(parsed);
        } catch (e) {
          console.error("Error parsing poll data:", e);
        }
      }
    }, [text]);

    const handleVote = (pollId, selectedOption) => {
      setPollData((prevData) => {
        const newData = { ...prevData };
        newData.votes = { ...prevData.votes };
        newData.votes[selectedOption] =
          (newData.votes[selectedOption] || 0) + 1;
        return newData;
      });
      setVotedPolls((prev) => new Set([...prev, pollId]));
    };

    const handleLike = () => {
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleRetweet = () => {
      setIsRetweeted(!isRetweeted);
      setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
      if (!isRetweeted) alert("🔄 Siv retweeted!");
    };

    const handleComment = () => {
      const comment = prompt("💬 Add a comment:");
      if (comment?.trim()) {
        setCommentCount((prev) => prev + 1);
        alert("💬 Comment added!");
      }
    };

    const handleShare = () => {
      navigator.clipboard.writeText(
        `Check out this Siv: "${
          text.length > 50 ? text.substring(0, 50) + "..." : text
        }"`
      );
      setShareCount((prev) => prev + 1);
      alert("📤 Siv copied to clipboard!");
    };
    const isValidCID = (cid) => {
      return (
        cid &&
        typeof cid === "string" &&
        cid.length >= 46 &&
        /^[a-zA-Z0-9]+$/.test(cid)
      );
    };
    const getDisplayName = (name) => {
      if (!name) return "Anonymous";
      if (name.length > 20) {
        return `${name.slice(0, 6)}...${name.slice(-4)}`;
      }
      return name;
    };

    const avatarName = getDisplayName(displayName);
    const currentPollData = isPoll() ? getPollData() : null;

    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar
            name={avatarName}
            size="50"
            round={true}
            color="#bb2b7a"
            fgColor="#ffffff"
          />
        </div>

        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>{displayName}</h3>
            </div>
            <div className="post__headerDescription">
              {isPoll() ? (
                <Poll
                  question={currentPollData.question}
                  options={currentPollData.options}
                  votes={currentPollData.votes}
                  onVote={handleVote}
                  userHasVoted={votedPolls.has(currentPollData.id)}
                  pollId={currentPollData.id}
                />
              ) : (
                <p>{renderTextWithIPFSLinks(text)}</p>
              )}

              {/* Only show separate IPFS link if there's no embedded one in text */}
              {cid && !extractCIDFromText(text) && (
                <span
                  className="ipfs-link"
                  onClick={() => handleIPFSClick()}
                  style={{ cursor: "pointer" }}
                >
                  📂 View on IPFS
                </span>
              )}
            </div>
          </div>

          <div className="post__footer">
            <div className="post__footerOption" onClick={handleComment}>
              <ChatBubbleOutlineIcon fontSize="small" />
              <span className="post__footerCount">{commentCount}</span>
            </div>
            <div
              className={`post__footerOption ${
                isRetweeted ? "post__footerOption--active" : ""
              }`}
              onClick={handleRetweet}
            >
              <RepeatIcon fontSize="small" />
              <span className="post__footerCount">{retweetCount}</span>
            </div>
            <div
              className={`post__footerOption ${
                isLiked ? "post__footerOption--liked" : ""
              }`}
              onClick={handleLike}
            >
              {isLiked ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
              <span className="post__footerCount">{likeCount}</span>
            </div>
            <div className="post__footerOption" onClick={handleShare}>
              <PublishIcon fontSize="small" />
              <span className="post__footerCount">{shareCount}</span>
            </div>
            {personal && (
              <div
                className="post__footerOption post__footerOption--delete"
                onClick={onClick}
              >
                <DeleteIcon fontSize="small" />
              </div>
            )}
          </div>
        </div>

        {/* IPFS Modal */}
        <IPFSModal
          isOpen={showIPFSModal}
          onClose={() => setShowIPFSModal(false)}
          cid={selectedCID}
        />
      </div>
    );
  }
);

export default Post;
