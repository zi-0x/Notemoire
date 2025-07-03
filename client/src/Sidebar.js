import React from "react";
import "./Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import  Button  from "@mui/material/Button";
import logo from "./sclogo.png";

function Sidebar(){
  return (
        <div className="sidebar__siv">
          <img src={logo} className="sidebar__logo" alt="Sociva Logo" width="50%" margin ="5px" object-fit="cover"  />
          <SidebarOption Icon={HomeIcon} text="Home" />
          <SidebarOption Icon={SearchIcon} text="Explore" />
          <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
          <SidebarOption Icon={MailOutlineIcon} text="Messages" />
          <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
          <SidebarOption Icon={ListAltIcon} text="Lists"   /> 
          <SidebarOption Icon={PermIdentityIcon} text="Profile"/>
          <SidebarOption Icon={MoreHorizIcon} text="More" />
    
          {/* Button -> Siv */}
     <Button
      className="sidebar__siv"
      variant="outlined"
      sx={{ color: "#fffdeb",width:"90%",borderRadius:"50px",marginTop:"10px",padding:"10px", backgroundColor: "#bb2b7a", '&:hover': { backgroundColor: '#fffdeb', color: '#bb2b7a',borderColor: '#bb2b7a' } }}
    ><b>Siv</b></Button>
        </div>
      );

}

export default Sidebar;