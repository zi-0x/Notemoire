import React, { useState, useEffect, useCallback } from "react";
import "./Post.css"; // Assuming you have the modal styles here

const IPFSModal = ({ isOpen, onClose, cid, metadata }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Copied to clipboard!");
  };

  // FIXED: Wrap isPDFFile in useCallback to create stable reference
  const isPDFFile = useCallback(() => {
    return (
      metadata?.contentType === "application/pdf" ||
      metadata?.filename?.toLowerCase().includes(".pdf") ||
      metadata?.contentType?.includes("pdf")
    );
  }, [metadata]); // Add metadata as dependency

  useEffect(() => {
    if (isOpen && cid) {
      // For PDF files, don't try to fetch content - just show filename
      if (isPDFFile()) {
        setContent(null);
        setError(null);
        setLoading(false);
        return;
      }

      // For non-PDF files, try to fetch content
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
  }, [isOpen, cid, isPDFFile]); // Add isPDFFile to dependency array

  if (!isOpen) return null;

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
          {/* Metadata Section */}
          {metadata && (
            <div className="ipfs-content-section">
              <div className="ipfs-content-label">📊 File Metadata</div>

              <div className="ipfs-metadata">
                <div className="ipfs-metadata-item">
                  <strong>Filename</strong>
                  <div>{metadata.filename}</div>
                </div>

                <div className="ipfs-metadata-item">
                  <strong>Content Type</strong>
                  <div>{metadata.contentType}</div>
                </div>

                <div className="ipfs-metadata-item">
                  <strong>File Size</strong>
                  <div>{formatFileSize(metadata.size)}</div>
                </div>

                {metadata.lastModified && (
                  <div className="ipfs-metadata-item">
                    <strong>Last Modified</strong>
                    <div>
                      {new Date(metadata.lastModified).toLocaleString()}
                    </div>
                  </div>
                )}

                {metadata.error && (
                  <div className="ipfs-metadata-item">
                    <strong>⚠️ Fetch Error</strong>
                    <div style={{ color: "#e74c3c" }}>{metadata.error}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CID Section */}
          <div className="ipfs-content-section">
            <div className="ipfs-content-label">
              🔑 Content Identifier (CID)
            </div>
            <div
              className="ipfs-cid"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span
                style={{
                  flex: 1,
                  wordBreak: "break-all",
                  fontSize: "13px",
                  fontFamily: "monospace",
                }}
              >
                {cid}
              </span>
              <button
                onClick={() => copyToClipboard(cid)}
                style={{
                  background: "var(--primary-color, #bb2b7a)",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                📋 Copy
              </button>
            </div>
          </div>

          {/* Gateway Links */}
          {metadata?.gateways && (
            <div className="ipfs-content-section">
              <div className="ipfs-content-label">🌐 IPFS Gateways</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {metadata.gateways.map((gateway, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <a
                      href={gateway}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        color: "var(--primary-color, #bb2b7a)",
                        textDecoration: "none",
                        fontSize: "13px",
                        wordBreak: "break-all",
                      }}
                    >
                      {gateway}
                    </a>
                    <button
                      onClick={() => copyToClipboard(gateway)}
                      style={{
                        background: "transparent",
                        border: "1px solid #ddd",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview Section - Modified for PDFs */}
          <div className="ipfs-content-section">
            <div className="ipfs-content-label">👁️ Content Preview</div>

            {isPDFFile() ? (
              /* Special handling for PDF files with WHITE TEXT */
              <div
                className="ipfs-pdf-preview"
                style={{
                  padding: "20px",
                  backgroundColor: "#2d004c",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "2px dashed #dee2e6",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>📄</div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "white",
                  }}
                >
                  PDF Document
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "white",
                    marginBottom: "15px",
                  }}
                >
                  {metadata?.filename || "PDF File"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "white",
                  }}
                >
                  {metadata?.size
                    ? `Size: ${formatFileSize(metadata.size)}`
                    : "PDF documents cannot be previewed as text"}
                </div>
              </div>
            ) : (
              /* Regular content preview for non-PDF files */
              <>
                {loading && (
                  <div
                    className="ipfs-loading"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <div
                      className="ipfs-loading-spinner"
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: "2px solid #f3f3f3",
                        borderTop: "2px solid #bb2b7a",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "10px",
                      }}
                    ></div>
                    Loading content...
                  </div>
                )}

                {error && (
                  <div
                    className="ipfs-error"
                    style={{
                      padding: "15px",
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  >
                    ❌ Failed to load content: {error}
                    <br />
                    <small>
                      This might be a binary file that cannot be displayed as
                      text.
                    </small>
                  </div>
                )}

                {content && !loading && (
                  <div
                    className="ipfs-content-text"
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      maxHeight: "200px",
                      overflow: "auto",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {content}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="ipfs-content-section">
            <div className="ipfs-content-label">⚡ Quick Actions</div>
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
                🔗 Open in New Tab
              </button>

              <button
                onClick={() =>
                  copyToClipboard(`https://gateway.pinata.cloud/ipfs/${cid}`)
                }
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
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPFSModal;
