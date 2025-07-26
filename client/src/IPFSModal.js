import React, { useState, useEffect, useCallback } from "react";
import "./Post.css";

const IPFSModal = ({ isOpen, onClose, cid, metadata }) => {
  // FIXED: Correct useState syntax - you were missing the state variables
  // eslint-disable-next-line
  const [content, setContent] = useState(null);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [pinataMetadata, setPinataMetadata] = useState(null);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const PINATA_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNGFiNjEwMC1jNmFmLTQwMTYtYTYxMC0yNmQ0YjMxNTFhMTUiLCJlbWFpbCI6InNpbmdhcG9vcjEyNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzIwYjY5MzBjOTVmOGM4MGE1OGQiLCJzY29wZWRLZXlTZWNyZXQiOiIyNDU1MTE0OGZlNDFlZmUxNzFjMjllMDUyOTgxNzc4ZjY1NGZkYTJkOWJhOGZlOTJjMTU0ZjM2NDBkN2U1MjFkIiwiZXhwIjoxNzg1MDYzNjExfQ.jaZ3J_-aHjJIuspBjoLeHzbg777pQ3hig2j3RPdyfcs";

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      let date;
      if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
      } else {
        date = new Date(timestamp);
      }
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid date";
    }
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "Unknown";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const fetchPinataMetadata = useCallback(
    async (cid) => {
      if (!cid) return;
      setFetchingMetadata(true);
      try {
        const response = await fetch(
          `https://api.pinata.cloud/data/pinList?hashContains=${cid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${PINATA_JWT}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.rows && data.rows.length > 0) {
            const fileData = data.rows[0];
            setPinataMetadata({
              filename:
                fileData.metadata?.name ||
                fileData.metadata?.originalName ||
                "Unknown",
              size: fileData.size,
              pinDate: fileData.date_pinned,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching Pinata metadata:", error);
      } finally {
        setFetchingMetadata(false);
      }
    },
    [PINATA_JWT]
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Copied to clipboard!");
  };

  const isPDFFile = useCallback(() => {
    return (
      metadata?.contentType === "application/pdf" ||
      metadata?.filename?.toLowerCase().includes(".pdf") ||
      metadata?.contentType?.includes("pdf") ||
      pinataMetadata?.filename?.toLowerCase().includes(".pdf")
    );
  }, [metadata, pinataMetadata]);

  const hasFile = useCallback(() => {
    return (
      cid &&
      (pinataMetadata?.filename !== "Unknown" ||
        metadata?.filename ||
        pinataMetadata?.size ||
        metadata?.size)
    );
  }, [cid, pinataMetadata, metadata]);

  // FIXED: Added missing dependencies to useEffect
  useEffect(() => {
    if (isOpen && cid) {
      fetchPinataMetadata(cid);

      if (isPDFFile()) {
        setContent(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
        .then((text) => {
          setContent(
            text.length > 1000 ? text.substring(0, 1000) + "..." : text
          );
        })
        .catch((err) => {
          console.error("Error fetching IPFS content:", err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    isOpen,
    cid,
    isPDFFile,
    fetchPinataMetadata,
    setContent,
    setError,
    setLoading,
  ]); // Added missing dependencies

  if (!isOpen) return null;

  const combinedMetadata = {
    ...metadata,
    ...pinataMetadata,
    filename: pinataMetadata?.filename || metadata?.filename,
    size: pinataMetadata?.size || metadata?.size,
  };

  return (
    <div className="ipfs-modal-overlay" onClick={onClose}>
      <div className="ipfs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ipfs-modal-header">
          <h3 className="ipfs-modal-title">🔗 IPFS File Details</h3>
          <button className="ipfs-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ipfs-modal-content">
          {/* Essential File Info Only */}
          <div className="ipfs-content-section">
            <div className="ipfs-content-label">
               File Info
              {fetchingMetadata && (
                <span style={{ fontSize: "12px", marginLeft: "8px" }}>
                  
                </span>
              )}
            </div>

            <div className="ipfs-metadata">
              <div className="ipfs-metadata-item">
                <strong>Filename</strong>
                <div>{renderValue(combinedMetadata.filename)}</div>
              </div>

              <div className="ipfs-metadata-item">
                <strong>File Size</strong>
                <div>{formatFileSize(combinedMetadata.size)}</div>
              </div>

              {pinataMetadata?.pinDate && (
                <div className="ipfs-metadata-item">
                  <strong>📅 Upload Date</strong>
                  <div>{formatTimestamp(pinataMetadata.pinDate)}</div>
                </div>
              )}
            </div>
          </div>

          {/* CONDITIONAL: Simple Actions - Only show if file exists */}
          {hasFile() && (
            <div className="ipfs-content-section">
              <div className="ipfs-content-label"> Actions</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() =>
                    window.open(
                      `https://gateway.pinata.cloud/ipfs/${cid}`,
                      "_blank"
                    )
                  }
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#bb2b7a",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🔗 Open File
                </button>

                <button
                  onClick={() => copyToClipboard(cid)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  📋 Copy CID
                </button>
              </div>
            </div>
          )}

          {/* Show message when no file is detected */}
          {!hasFile() && (
            <div className="ipfs-content-section">
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <div style={{ fontWeight: "500", marginBottom: "8px" }}>
                  No File Detected
                </div>
                <div style={{ fontSize: "12px" }}>
                  This IPFS link doesn't contain file metadata or the file is
                  not accessible.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPFSModal;
