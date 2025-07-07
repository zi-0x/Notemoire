import React, { forwardRef, useState, useEffect } from "react";
import "./Post.css";
import Avatar from 'react-avatar';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from '@mui/icons-material/Delete';
import Poll from './Poll';

const Post = forwardRef(
  ({ displayName, text, personal, onClick }, ref) => {
    const [votedPolls, setVotedPolls] = useState(new Set());
    const [pollData, setPollData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(Math.floor(Math.random() * 50));
    const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 30));
    const [shareCount, setShareCount] = useState(Math.floor(Math.random() * 20));

    // Check if this is a poll
    const isPoll = () => {
      try {
        const parsed = JSON.parse(text);
        return parsed.type === 'poll';
      } catch (e) {
        return false;
      }
    };

    // Get poll data
    const getPollData = () => {
      try {
        const parsed = JSON.parse(text);
        return pollData || parsed;
      } catch (e) {
        return null;
      }
    };

    // Initialize poll data on component mount
    useEffect(() => {
      if (isPoll()) {
        try {
          const parsed = JSON.parse(text);
          setPollData(parsed);
        } catch (e) {
          console.error('Error parsing poll data:', e);
        }
      }
    }, [text]);

    // Handle voting
    const handleVote = (pollId, selectedOption) => {
      console.log(`Voting for option: ${selectedOption} in poll: ${pollId}`);
      
      // Update the poll data with the new vote
      setPollData(prevData => {
        const newData = { ...prevData };
        newData.votes = { ...prevData.votes };
        newData.votes[selectedOption] = (newData.votes[selectedOption] || 0) + 1;
        return newData;
      });
      
      // Mark that user has voted
      setVotedPolls(prev => new Set([...prev, pollId]));
      
      // TODO: Update blockchain with vote in a real implementation
    };

    // Handle like toggle
    const handleLike = () => {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    // Handle retweet toggle
    const handleRetweet = () => {
      setIsRetweeted(!isRetweeted);
      setRetweetCount(prev => isRetweeted ? prev - 1 : prev + 1);
      if (!isRetweeted) {
        alert("🔄 Siv retweeted!");
      }
    };

    // Handle comment
    const handleComment = () => {
      const comment = prompt("💬 Add a comment:");
      if (comment && comment.trim()) {
        setCommentCount(prev => prev + 1);
        alert("💬 Comment added!");
      }
    };

    // Handle share
    const handleShare = () => {
      navigator.clipboard.writeText(`Check out this Siv: "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`);
      setShareCount(prev => prev + 1);
      alert("📤 Siv copied to clipboard!");
    };

    // Truncate long wallet addresses for avatar display
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
              <h3>
                {displayName}{" "}
              </h3>
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
                <p>{text}</p>
              )}
            </div>
          </div>
          <div className="post__footer">
            <div className="post__footerOption" onClick={handleComment}>
              <ChatBubbleOutlineIcon fontSize="small" />
              <span className="post__footerCount">{commentCount}</span>
            </div>
            <div className={`post__footerOption ${isRetweeted ? 'post__footerOption--active' : ''}`} onClick={handleRetweet}>
              <RepeatIcon fontSize="small" />
              <span className="post__footerCount">{retweetCount}</span>
            </div>
            <div className={`post__footerOption ${isLiked ? 'post__footerOption--liked' : ''}`} onClick={handleLike}>
              {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              <span className="post__footerCount">{likeCount}</span>
            </div>
            <div className="post__footerOption" onClick={handleShare}>
              <PublishIcon fontSize="small" />
              <span className="post__footerCount">{shareCount}</span>
            </div>
            {personal ? (
              <div className="post__footerOption post__footerOption--delete" onClick={onClick}>
                <DeleteIcon fontSize="small" />
              </div>
            ) : ("")}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;