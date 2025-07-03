import React from "react";
import "./Widgets.css";
import SearchIcon from "@mui/icons-material/Search";

function Widgets() {
    return(
        <div className="widgets">
            <div className="widgets_input">
                <SearchIcon className="widgets_searchIcon"  />
                <input placeholder="Search Sociva Sivs" type="text" color="#d477aa" />
            </div>

            <div className="widgets__widgetContainer">
                <h2>What's Happening</h2>
                <div className="widgets__widget">
          <div className="widgets__widgetContent">
            <h3>Trending in Decentralized Social</h3>
            <p>#Web3Social</p>
            <span>12.5K Sivs</span>
          </div>
        </div>

        <div className="widgets__widget">
          <div className="widgets__widgetContent">
            <h3>Blockchain</h3>
            <p>#DecentralizedSocial</p>
            <span>8.2K Sivs</span>
          </div>
        </div>

        <div className="widgets__widget">
          <div className="widgets__widgetContent">
            <h3>Technology</h3>
            <p>#Ethereum</p>
            <span>15.1K Sivs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Widgets;