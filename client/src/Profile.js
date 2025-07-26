import React, { useState, } from "react";
import "./Profile.css";
import Avatar from 'react-avatar';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";

import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Post from "./Post";

function Profile({ onBack, userAddress }) {
  const [activeTab, setActiveTab] = useState(0);
  const [userProfile, /*setUserProfile*/] = useState({
    name: userAddress ? `User ${userAddress.slice(-4)}` : "Sociva User",
    address: userAddress || "0x1234...5678",
    bio: "Building the future of decentralized social media 🚀",
    location: "Metaverse",
    website: "https://sociva.social",
    joinedDate: "June 2024",
    verified: false,
    following: 198,
    followers: 156,
    sivs: 42,
    isFollowing: false
  });

  const [userSivs, setUserSivs] = useState([
    {
      id: 1,
      text: "Just posted my first Siv on this amazing decentralized platform! 🎉",
      timestamp: "2h",
      likes: 15,
      retweets: 3,
      comments: 7
    },
    {
      id: 2,
      text: "The future of social media is decentralized. No more censorship, no more data harvesting. We own our data! 💪",
      timestamp: "1d",
      likes: 42,
      retweets: 18,
      comments: 12
    },
    {
      id: 3,
      text: JSON.stringify({
        type: 'poll',
        id: 'poll_profile_demo',
        question: "What's the most important feature in a decentralized social platform?",
        options: ["Privacy", "Censorship Resistance", "Data Ownership", "Community Governance"],
        votes: { "Privacy": 25, "Censorship Resistance": 18, "Data Ownership": 32, "Community Governance": 15 }
      }),
      timestamp: "2d",
      likes: 28,
      retweets: 12,
      comments: 20
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

 

  const handleStatClick = (statType) => {
    switch(statType) {
      case 'followers':
        alert(`👥 ${userProfile.followers} followers - View all followers`);
        break;
      case 'following':
        alert(`➡️ Following ${userProfile.following} accounts - Manage following`);
        break;
      default:
        break;
    }
  };

  const getDisplayName = (address) => {
    if (!address) return "Anonymous";
    if (address.length > 20) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <div className="profile">
      {/* Header */}
      <div className="profile__header">
        <div className="profile__headerTop">
          <div className="profile__backButton" onClick={onBack}>
            <ArrowBackIcon />
          </div>
          <div className="profile__headerInfo">
            <h2>{userProfile.name}</h2>
            <span className="profile__sivCount">{userProfile.sivs} Sivs</span>
          </div>
        </div>
      </div>

      {/* Cover and Avatar Section */}
      <div className="profile__coverSection">
        <div className="profile__cover"></div>
        <div className="profile__avatarSection">
          <div className="profile__avatar">
            <Avatar 
              name={userProfile.name} 
              size="120" 
              round={true}
              color="#bb2b7a"
              fgColor="#ffffff"
            />
          </div>
          <div className="profile__actions">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              className="profile__editButton"
              size="small"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile__info">
        <div className="profile__nameSection">
          <h1 className="profile__name">
            {userProfile.name}
            {userProfile.verified && <VerifiedIcon className="profile__verified" />}
          </h1>
          <span className="profile__address">{getDisplayName(userProfile.address)}</span>
        </div>

        <p className="profile__bio">{userProfile.bio}</p>

        <div className="profile__metadata">
          {userProfile.location && (
            <div className="profile__metaItem">
              <LocationOnIcon fontSize="small" />
              <span>{userProfile.location}</span>
            </div>
          )}
          {userProfile.website && (
            <div className="profile__metaItem">
              <LinkIcon fontSize="small" />
              <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                {userProfile.website.replace('https://', '')}
              </a>
            </div>
          )}
          <div className="profile__metaItem">
            <CalendarTodayIcon fontSize="small" />
            <span>Joined {userProfile.joinedDate}</span>
          </div>
        </div>

        <div className="profile__stats">
          <div className="profile__stat" onClick={() => handleStatClick('following')}>
            <span className="profile__statNumber">{userProfile.following}</span>
            <span className="profile__statLabel">Following</span>
          </div>
          <div className="profile__stat" onClick={() => handleStatClick('followers')}>
            <span className="profile__statNumber">{userProfile.followers}</span>
            <span className="profile__statLabel">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile__tabs">
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Sivs" />
          <Tab label="Replies" />
          <Tab label="Media" />
          <Tab label="Likes" />
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="profile__content">
        <TabPanel value={activeTab} index={0}>
          <div className="profile__sivs">
            {userSivs.map((siv, index) => (
              <Post
                key={siv.id}
                displayName={userProfile.name}
                text={siv.text}
                personal={true}
                onClick={() => {
                  if (window.confirm("Delete this Siv?")) {
                    setUserSivs(prev => prev.filter(s => s.id !== siv.id));
                  }
                }}
              />
            ))}
          </div>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <div className="profile__emptyState">
            <p>No replies yet</p>
          </div>
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <div className="profile__emptyState">
            <p>No media yet</p>
          </div>
        </TabPanel>
        
        <TabPanel value={activeTab} index={3}>
          <div className="profile__emptyState">
            <p>No likes yet</p>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

export default Profile;
