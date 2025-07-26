import React from "react";
import "./SidebarOption.css";
import Badge from "@mui/material/Badge";

function SidebarOption({ text, Icon, active, onClick, badge, nested }) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div 
            className={`sidebarOption ${active ? 'sidebarOption--active' : ''} ${nested ? 'sidebarOption--nested' : ''}`}
            onClick={handleClick}
        >
            {badge && badge > 0 ? (
                <Badge badgeContent={badge}  className="sidebarOption__badge">
                    <Icon />
                </Badge>
            ) : (
                <Icon />
            )}
            <h2>{text}</h2>
        </div>
    );
}

export default SidebarOption;
