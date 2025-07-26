import React, { useState, useEffect, useCallback } from "react";
import SivBox from "./SivBox.js";
import Post from "./Post.js";
import "./Feed.css";
import FlipMove from "react-flip-move";
import Sociva from "./utils/socivaContract.json";
import { SocivaContractAddress } from "./config.js";
import { BrowserProvider, Contract } from "ethers";

function Feed() {
  const [posts, setPosts] = useState([]);

  // FIXED: Wrap isProbablyCID in useCallback to prevent dependency changes
  const isProbablyCID = useCallback((str) => {
    return /^[a-zA-Z0-9]{46,}$/.test(str); // crude base58/base32 CID check
  }, []);

  // Now getUpdatedSivs has a stable dependency
  const getUpdatedSivs = useCallback(
    async (allSivs, address) => {
      const updatedSivs = [];

      for (let i = 0; i < allSivs.length; i++) {
        let ipfsText;
        if (isProbablyCID(allSivs[i].sivText)) {
          try {
            const res = await fetch(
              `https://w3s.link/ipfs/${allSivs[i].sivText}`
            );
            ipfsText = await res.text();
          } catch (e) {
            ipfsText = "[Failed to load content]";
          }
        } else {
          ipfsText = allSivs[i].sivText;
        }

        updatedSivs.push({
          id: allSivs[i].id,
          cid: allSivs[i].sivText,
          sivText: ipfsText,
          isDeleted: allSivs[i].isDeleted,
          username: allSivs[i].username,
          personal: allSivs[i].username.toLowerCase() === address.toLowerCase(),
        });
      }

      return updatedSivs.reverse();
    },
    [isProbablyCID]
  ); // isProbablyCID is now stable

  const getAllSivs = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const socivaContract = new Contract(
          SocivaContractAddress,
          Sociva.abi,
          signer
        );

        let allSivs = await socivaContract.getAllSivs();
        const updated = await getUpdatedSivs(allSivs, ethereum.selectedAddress);
        setPosts(updated);
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [getUpdatedSivs]);

  useEffect(() => {
    getAllSivs();
  }, [getAllSivs]);

  const deleteSiv = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const socivaContract = new Contract(
          SocivaContractAddress,
          Sociva.abi,
          signer
        );

        await socivaContract.deleteSiv(key, true);
        getAllSivs();
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Refresh callback function
  const handleRefreshFeed = () => {
    console.log("Refreshing feed after new post...");
    getAllSivs(); // Re-fetch all posts
  };

  // Optional: Additional callback when post is created
  const handleNewPost = () => {
    console.log("New post created!");
    // You can add any additional logic here if needed
  };

  return (
    <div className="feed">
      <div className="feed_header">
        <h2>Home</h2>
      </div>

      <SivBox onPost={handleNewPost} refreshFeed={handleRefreshFeed} />

      <div className="feed__content">
        <FlipMove>
          {Array.isArray(posts) &&
            posts.map((post) => (
              <div key={post.id} className="feed__post">
                <Post
                  displayName={post.username}
                  text={post.sivText}
                  cid={post.cid}
                  personal={post.personal}
                  onClick={deleteSiv(post.id)}
                />
              </div>
            ))}
        </FlipMove>
      </div>
    </div>
  );
}

export default Feed;
