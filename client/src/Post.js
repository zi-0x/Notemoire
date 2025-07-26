import React, { forwardRef, useState, useEffect, useCallback } from "react";
import "./Post.css";
import Avatar from "react-avatar";
// REMOVED: VerifiedUserIcon import (unused)
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import Poll from "./Poll";
import IPFSModal from "./IPFSModal";

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
    const [ipfsMetadata, setIpfsMetadata] = useState(null);
    const [loadingMetadata, setLoadingMetadata] = useState(false);

    // SIMPLIFIED CID validation - more permissive
    const isValidCID = (cidToCheck) => {
      if (!cidToCheck || typeof cidToCheck !== "string") return false;
      // More relaxed validation - just check if it's a reasonable length and alphanumeric
      return cidToCheck.length >= 20 && /^[a-zA-Z0-9]+$/.test(cidToCheck);
    };

    // SIMPLIFIED CID extraction with multiple patterns
    const extractCIDFromText = (text) => {
      console.log("Extracting CID from text:", text);

      // Try multiple patterns to find CID
      const patterns = [
        /🔗\s*IPFS:\s*([a-zA-Z0-9]{20,})/i, // Standard IPFS format
        /IPFS:\s*([a-zA-Z0-9]{20,})/i, // Without emoji
        /ipfs\/([a-zA-Z0-9]{20,})/i, // Direct IPFS path
        /([a-zA-Z0-9]{46,})/, // Any long alphanumeric string
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const foundCID = match[1];
          console.log("Found CID:", foundCID);
          return foundCID;
        }
      }

      console.log("No CID found in text");
      return null;
    };

    // SIMPLIFIED PDF detection
    const hasPDF = () => {
      return (
        text.includes("📄") ||
        text.includes(".pdf") ||
        text.toLowerCase().includes("pdf")
      );
    };

    // Get any CID available
    const getAvailableCID = () => {
      // Try prop first, then extract from text
      if (cid && isValidCID(cid)) {
        console.log("Using CID from prop:", cid);
        return cid;
      }

      const extractedCID = extractCIDFromText(text);
      if (extractedCID && isValidCID(extractedCID)) {
        console.log("Using extracted CID:", extractedCID);
        return extractedCID;
      }

      console.log("No valid CID found");
      return null;
    };

    // Fetch IPFS metadata with better error handling
    const fetchIPFSMetadata = async (cidToUse) => {
      setLoadingMetadata(true);
      try {
        console.log("Fetching metadata for CID:", cidToUse);

        // Try multiple gateways for metadata
        const gateways = [
          `https://gateway.pinata.cloud/ipfs/${cidToUse}`,
          `https://ipfs.io/ipfs/${cidToUse}`,
          `https://cloudflare-ipfs.com/ipfs/${cidToUse}`,
        ];

        let metadata = null;

        for (const gateway of gateways) {
          try {
            const response = await fetch(gateway, { method: "HEAD" });
            if (response.ok) {
              const contentType =
                response.headers.get("content-type") || "unknown";
              const contentLength = response.headers.get("content-length");
              const lastModified = response.headers.get("last-modified");

              metadata = {
                cid: cidToUse,
                filename: extractPDFFromText(text) || "Unknown file",
                contentType: contentType,
                size: contentLength ? parseInt(contentLength) : null,
                lastModified: lastModified,
                workingGateway: gateway,
                gateways: gateways,
              };
              break;
            }
          } catch (err) {
            console.log("Gateway failed:", gateway, err.message);
            continue;
          }
        }

        if (!metadata) {
          throw new Error("All gateways failed");
        }

        console.log("Fetched metadata:", metadata);
        setIpfsMetadata(metadata);
      } catch (error) {
        console.error("Error fetching IPFS metadata:", error);

        // Fallback metadata
        const fallbackMetadata = {
          cid: cidToUse,
          filename: extractPDFFromText(text) || "Unknown file",
          contentType: "application/pdf",
          size: null,
          error: error.message,
          gateways: [
            `https://gateway.pinata.cloud/ipfs/${cidToUse}`,
            `https://ipfs.io/ipfs/${cidToUse}`,
            `https://cloudflare-ipfs.com/ipfs/${cidToUse}`,
          ],
        };

        setIpfsMetadata(fallbackMetadata);
      } finally {
        setLoadingMetadata(false);
      }
    };

    // Extract PDF filename from text
    const extractPDFFromText = (text) => {
      // Look for filename after 📄 emoji
      const pdfMatch = text.match(/📄\s*([^\n🔗]+)/);
      if (pdfMatch) {
        return pdfMatch[1].trim();
      }

      // Look for .pdf files
      const pdfFileMatch = text.match(/([^\s]+\.pdf)/i);
      if (pdfFileMatch) {
        return pdfFileMatch[1];
      }

      // Look for cloudinary URLs
      const cloudinaryMatch = text.match(
        /https?:\/\/res\.cloudinary\.com\/[^\s]+/i
      );
      if (cloudinaryMatch) {
        return cloudinaryMatch[0];
      }

      return null;
    };

    // SIMPLIFIED PDF button
    const renderPDFButton = () => {
      const handlePDFClick = () => {
        console.log("=== PDF BUTTON CLICKED ===");
        console.log("Text:", text);
        console.log("CID prop:", cid);

        // First try to find a direct URL in text
        const directURL = text.match(/https?:\/\/[^\s]+\.pdf/i);
        if (directURL) {
          console.log("Opening direct PDF URL:", directURL[0]);
          window.open(directURL[0], "_blank", "noopener,noreferrer");
          return;
        }

        // Try to use CID for IPFS
        const cidToUse = getAvailableCID();
        if (cidToUse) {
          const gateways = [
            `https://gateway.pinata.cloud/ipfs/${cidToUse}`,
            `https://ipfs.io/ipfs/${cidToUse}`,
            `https://cloudflare-ipfs.com/ipfs/${cidToUse}`,
          ];

          console.log("Opening IPFS PDF:", gateways[0]);
          window.open(gateways[0], "_blank", "noopener,noreferrer");
        } else {
          console.error("No valid PDF link found");
          alert("❌ Could not find a valid PDF link");
        }
      };

      return (
        <div style={{ marginTop: "8px" }}>
          <button
            onClick={handlePDFClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
              transition: "all 0.3s ease",
              minWidth: "100px",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.2)";
            }}
          >
            <span style={{ fontSize: "14px" }}>📄</span>
            View PDF
          </button>
        </div>
      );
    };

    // SIMPLIFIED text processing
    const renderContent = () => {
      // Clean up the text for display
      let cleanText = text
        .replace(/📄\s*[^\n🔗]+/g, "") // Remove PDF filename line
        .replace(/🔗\s*IPFS:\s*[^\s\n]+/gi, "") // Remove IPFS line
        .replace(/https?:\/\/[^\s]+\.pdf/gi, "") // Remove direct PDF URLs
        .trim();

      return (
        <div>
          <div style={{ whiteSpace: "pre-wrap" }}>{cleanText}</div>
          {hasPDF() && renderPDFButton()}
        </div>
      );
    };

    // Enhanced IPFS click handler
    const handleIPFSClick = async () => {
      const cidToUse = getAvailableCID();

      if (!cidToUse) {
        alert("❌ No IPFS link found");
        return;
      }

      console.log("IPFS button clicked, fetching metadata for CID:", cidToUse);

      // Fetch metadata before opening modal
      await fetchIPFSMetadata(cidToUse);

      setSelectedCID(cidToUse);
      setShowIPFSModal(true);
    };

    // FIXED: Wrap isPoll in useCallback to create stable reference
    const isPoll = useCallback(() => {
      try {
        const parsed = JSON.parse(text);
        return parsed.type === "poll";
      } catch (e) {
        return false;
      }
    }, [text]);

    const getPollData = () => {
      try {
        const parsed = JSON.parse(text);
        return pollData || parsed;
      } catch (e) {
        return null;
      }
    };

    // FIXED: Add isPoll to useEffect dependency array
    // Alternative: Just use text directly since isPoll depends on it anyway
    useEffect(() => {
      if (isPoll()) {
        try {
          const parsed = JSON.parse(text);
          setPollData(parsed);
        } catch (e) {
          console.error("Error parsing poll data:", e);
        }
      }
    }, [text, isPoll]); // This is the most explicit and clear
    // Add isPoll to dependencies

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

    // Other handlers (unchanged)
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
                renderContent()
              )}
            </div>

            {/* IPFS Button with better availability check */}
            {getAvailableCID() && (
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={handleIPFSClick}
                  disabled={loadingMetadata}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    background: loadingMetadata
                      ? "linear-gradient(135deg, #666, #888)"
                      : "linear-gradient(135deg, #2d004c, #4a0080)",
                    color: loadingMetadata ? "#ccc" : "#a88bfd",
                    border: "1px solid rgba(168, 139, 253, 0.3)",
                    borderRadius: "20px",
                    cursor: loadingMetadata ? "wait" : "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                    boxShadow: "0 2px 8px rgba(45, 0, 76, 0.2)",
                    transition: "all 0.3s ease",
                    minWidth: "100px",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMetadata) {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(45, 0, 76, 0.3)";
                      e.target.style.color = "#c4a8ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingMetadata) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(45, 0, 76, 0.2)";
                      e.target.style.color = "#a88bfd";
                    }
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {loadingMetadata ? "⏳" : "🔗"}
                  </span>
                  {loadingMetadata ? "Loading..." : "View IPFS"}
                </button>
              </div>
            )}
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

        {/* IPFS Modal with Metadata */}
        <IPFSModal
          isOpen={showIPFSModal}
          onClose={() => {
            setShowIPFSModal(false);
            setIpfsMetadata(null);
          }}
          cid={selectedCID}
          metadata={ipfsMetadata}
        />
      </div>
    );
  }
);

export default Post;
