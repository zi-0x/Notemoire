// Update your IPFSModal.js
import React, { useState, useEffect } from "react";
import { fetchFromIPFS } from "./w3client.js";

const IPFSModal = ({ isOpen, onClose, cid }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (isOpen && cid) {
      fetchIPFSContent();
    }
  }, [isOpen, cid]);

  const fetchIPFSContent = async () => {
    setLoading(true);
    setError(null);
    setContent(null);

    try {
      console.log(`[IPFS Modal] Fetching content for CID: ${cid}`);
      const data = await fetchFromIPFS(cid);

      // Extract timestamp and clean content
      const timestamp = extractTimestamp(data) || getCurrentTimestamp();
      const cleanContent = data.replace(/^siv-\d+\.txt\n?/, "");

      setContent(cleanContent);
      setMetadata({
        timestamp: timestamp,
        size: new Blob([data]).size,
        cid: cid,
        uploaded: new Date().toLocaleString(), // Current time as fallback
      });

      console.log(`[IPFS Modal] ✅ Content fetched successfully`);
    } catch (err) {
      console.error(`[IPFS Modal] ❌ Failed to fetch content:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractTimestamp = (content) => {
    // Try multiple timestamp patterns
    const patterns = [
      /timestamp[":]\s*["']?([^"',\n]+)["']?/i,
      /"uploaded":\s*"([^"]+)"/i,
      /"timestamp":\s*"([^"]+)"/i,
      /uploaded:\s*([^\n,}]+)/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        try {
          const date = new Date(match[1]);
          if (!isNaN(date.getTime())) {
            return date.toLocaleString();
          }
        } catch (e) {
          continue;
        }
      }
    }
    return null;
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ipfs-modal-overlay" onClick={handleOverlayClick}>
      <div className="ipfs-modal">
        <div className="ipfs-modal-header">
          <h3 className="ipfs-modal-title">📄 IPFS Content</h3>
          <button className="ipfs-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ipfs-modal-content">
          {loading && (
            <div className="ipfs-loading">
              <div className="ipfs-loading-spinner"></div>
              <p>Fetching content from IPFS...</p>
            </div>
          )}

          {error && (
            <div className="ipfs-error">
              <p>❌ Failed to load content: {error}</p>
              <button className="ipfs-retry-btn" onClick={fetchIPFSContent}>
                Retry
              </button>
            </div>
          )}

          {content && (
            <>
              <div className="ipfs-content-section">
                <div className="ipfs-content-label">Original Message</div>
                <div className="ipfs-content-text">{content}</div>
              </div>

              {metadata && (
                <div className="ipfs-content-section">
                  <div className="ipfs-content-label">Metadata</div>
                  <div className="ipfs-metadata">
                    <div className="ipfs-metadata-item">
                      <strong>Uploaded</strong>
                      {metadata.timestamp}
                    </div>
                    <div className="ipfs-metadata-item">
                      <strong>Size</strong>
                      {metadata.size} bytes
                    </div>
                  </div>
                  <div className="ipfs-content-section">
                    <div className="ipfs-content-label">Content ID (CID)</div>
                    <div className="ipfs-cid">{metadata.cid}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPFSModal;
