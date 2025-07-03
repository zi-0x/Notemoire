import React, { useState, useEffect } from "react";
import SivBox from "./SivBox.js";
import Post from "./Post.js";
import "./Feed.css";
import FlipMove from "react-flip-move";
import axios from 'axios';
import Sociva from './utils/socivaContract.json';
import { SocivaContractAddress } from './config.js';
import { BrowserProvider, Contract } from "ethers";

function Feed(){

  const [posts, setPosts] = useState([]);
  
const getUpdatedSivs = (allSivs, address) => {
    let updatedSivs = [];
    // Here we set a personal flag around the sivs
    for(let i=0; i<allSivs.length; i++) {
      if(allSivs[i].username.toLowerCase() === address.toLowerCase()) {
        let siv = {
          'id': allSivs[i].id,
          'sivText': allSivs[i].sivText,
          'isDeleted': allSivs[i].isDeleted,
          'username': allSivs[i].username,
          'personal': true
        };
        updatedSivs.push(siv);
      } else {
          let siv = {
          'sivText': allSivs[i].sivText,
          'id': allSivs[i].id,
          'isDeleted': allSivs[i].isDeleted,
          'username': allSivs[i].username,
          'personal': false
        };
        updatedSivs.push(siv);
      }
    }
    return updatedSivs.reverse();
  }

  const getAllSivs = async () => {
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
        setPosts(getUpdatedSivs(allSivs, ethereum.selectedAddress));
      }else{
        console.log("Ethereum object not found");
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getAllSivs();
  }, []);

  const deleteSiv = key => async () => {
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

       let deleteSivTx = await socivaContract.deleteSiv(key,true);
       let allSivs
        setPosts(getUpdatedSivs(allSivs, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

   return (
    <div className="feed">
      <div className="feed_header">
        <h2>Home</h2>
      </div>

      <SivBox />
      <FlipMove>
        {posts.map((post) => (
          <Post 
          key={post.id}
          post={post} 
          displayName={post.username}
          text={post.sivText}
          personal={post.personal}
          onClick={deleteSiv(post.id)}
           />
        ))}
      </FlipMove>
    </div>
  );


}

export default Feed;