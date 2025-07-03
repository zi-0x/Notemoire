import React, { forwardRef } from "react";
import "./Post.css";
import Avatar from 'react-avatar';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from '@mui/icons-material/Delete';

const Post = forwardRef(
  ({ displayName, text, personal, onClick }, ref) => {
    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar name={displayName} size="100" round={true} />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {displayName}{" "}
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            <PublishIcon fontSize="small" />
            {personal ? (
              <DeleteIcon fontSize="small" onClick={onClick}/>
            ) : ("")}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;