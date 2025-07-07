import React, { useState, useEffect } from "react";
import "./Widgets.css";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedIcon from "@mui/icons-material/Verified";
import Avatar from 'react-avatar';

function Widgets() {
    const [searchTerm, setSearchTerm] = useState("");
    const [trending, setTrending] = useState([
        {
            id: 1,
            category: "Trending in Decentralized Social",
            title: "#Web3Social",
            count: "12.5K",
            growth: "+25%"
        },
        {
            id: 2,
            category: "Blockchain",
            title: "#DecentralizedSocial",
            count: "8.2K",
            growth: "+18%"
        },
        {
            id: 3,
            category: "Technology",
            title: "#Ethereum",
            count: "15.1K",
            growth: "+12%"
        },
        {
            id: 4,
            category: "Crypto",
            title: "#DeFi",
            count: "6.8K",
            growth: "+35%"
        },
        {
            id: 5,
            category: "NFTs",
            title: "#DigitalArt",
            count: "4.2K",
            growth: "+28%"
        }
    ]);

    const [suggestions, setSuggestions] = useState([
        {
            id: 1,
            name: "Vitalik Buterin",
            address: "0x1234...5678",
            followers: "2.1M",
            verified: true,
            bio: "Ethereum Foundation"
        },
        {
            id: 2,
            name: "Coinbase",
            address: "0x9876...4321",
            followers: "5.3M",
            verified: true,
            bio: "Cryptocurrency Exchange"
        },
        {
            id: 3,
            name: "Web3 Builder",
            address: "0x5555...9999",
            followers: "45K",
            verified: false,
            bio: "Building the decentralized future"
        }
    ]);

    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [platformStats, setPlatformStats] = useState({
        totalSivs: "1.2M",
        activeUsers: "45.8K",
        pollsCreated: "8.9K",
        votesCast: "156K"
    });

    // Simulate real-time updates for trending topics
    useEffect(() => {
        const updateStats = () => {
            setTrending(prev => prev.map(trend => ({
                ...trend,
                count: Math.floor(Math.random() * 20000).toFixed(1) + "K",
                growth: "+" + Math.floor(Math.random() * 50) + "%"
            })));

            // Update platform stats
            setPlatformStats({
                totalSivs: (1.2 + Math.random() * 0.1).toFixed(1) + "M",
                activeUsers: (45.8 + Math.random() * 5).toFixed(1) + "K", 
                pollsCreated: (8.9 + Math.random() * 1).toFixed(1) + "K",
                votesCast: (156 + Math.random() * 20).toFixed(0) + "K"
            });
        };

        // Update stats every 30 seconds to simulate real-time data
        const interval = setInterval(updateStats, 30000);
        return () => clearInterval(interval);
    }, []);

    // Simulate search functionality
    useEffect(() => {
        if (searchTerm.length > 0) {
            const results = [
                ...trending.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())
                ),
                ...suggestions.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.bio.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(user => ({...user, type: 'user'}))
            ];
            setSearchResults(results);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchTerm, trending, suggestions]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            console.log(`Searching for: ${searchTerm}`);
            alert(`Searching for "${searchTerm}" across all Sivs...`);
            // In a real app, this would trigger a global search
        }
        if (e.key === 'Escape') {
            setSearchTerm("");
            setShowResults(false);
        }
    };

    const handleTrendClick = (trend) => {
        console.log(`Clicked on trending topic: ${trend.title}`);
        alert(`Searching for posts related to ${trend.title}...`);
        // In a real app, this would filter the feed or navigate to a trend page
    };

    const handleFollow = (user) => {
        console.log(`Following user: ${user.name}`);
        // In a real app, this would trigger a follow action
        setSuggestions(prev => 
            prev.map(u => 
                u.id === user.id 
                    ? {...u, isFollowing: !u.isFollowing}
                    : u
            )
        );
        
        // Show feedback
        alert(user.isFollowing ? `Unfollowed ${user.name}` : `Now following ${user.name}!`);
    };

    const getTrendIcon = (growth) => {
        return <TrendingUpIcon className="widgets__trendIcon" />;
    };

    return(
        <div className="widgets">
            {/* Search Section */}
            <div className="widgets__searchContainer">
                <div className="widgets__input">
                    <SearchIcon className="widgets__searchIcon" />
                    <input 
                        placeholder="Search Sociva Sivs" 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyDown={handleKeyPress}
                    />
                </div>
                
                {/* Search Results */}
                {showResults && (
                    <div className="widgets__searchResults">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <div key={index} className="widgets__searchResult">
                                    {result.type === 'user' ? (
                                        <div className="widgets__userResult">
                                            <Avatar 
                                                name={result.name} 
                                                size="40" 
                                                round={true}
                                                color="#bb2b7a"
                                                fgColor="#ffffff"
                                            />
                                            <div className="widgets__userInfo">
                                                <div className="widgets__userName">
                                                    {result.name}
                                                    {result.verified && <VerifiedIcon className="widgets__verified" />}
                                                </div>
                                                <div className="widgets__userBio">{result.bio}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="widgets__trendResult">
                                            <div className="widgets__trendTitle">{result.title}</div>
                                            <div className="widgets__trendCategory">{result.category}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="widgets__noResults">No results found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Trending Topics */}
            <div className="widgets__widgetContainer">
                <div className="widgets__widgetHeader">
                    <h2>What's Happening ?</h2>
                </div>
                <div className="widgets__widgetContent">
                    {trending.map((trend) => (
                        <div 
                            key={trend.id} 
                            className="widgets__trend"
                            onClick={() => handleTrendClick(trend)}
                        >
                            <div className="widgets__trendInfo">
                                <div className="widgets__trendCategory">{trend.category}</div>
                                <div className="widgets__trendTitle">{trend.title}</div>
                                <div className="widgets__trendCount">{trend.count} Sivs</div>
                            </div>
                            <div className="widgets__trendStats">
                                {getTrendIcon(trend.growth)}
                                <span className="widgets__trendGrowth">{trend.growth}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Who to Follow */}
            <div className="widgets__widgetContainer">
                <div className="widgets__widgetHeader">
                    <h2>Suggestions for you!</h2>
                </div>
                <div className="widgets__widgetContent">
                    {suggestions.map((user) => (
                        <div key={user.id} className="widgets__suggestion">
                            <div className="widgets__suggestionInfo">
                                <Avatar 
                                    name={user.name} 
                                    size="48" 
                                    round={true}
                                    color="#bb2b7a"
                                    fgColor="#ffffff"
                                />
                                <div className="widgets__suggestionDetails">
                                    <div className="widgets__suggestionName">
                                        {user.name}
                                        {user.verified && <VerifiedIcon className="widgets__verified" />}
                                    </div>
                                    <div className="widgets__suggestionBio">{user.bio}</div>
                                    <div className="widgets__suggestionStats">{user.followers} followers</div>
                                </div>
                            </div>
                            <button 
                                className={`widgets__followButton ${user.isFollowing ? 'following' : ''}`}
                                onClick={() => handleFollow(user)}
                            ><span className="widgets__followText">
                                {user.isFollowing ? (
                                    <>Following</>
                                ) : (
                                    <>
                                        <PersonAddIcon fontSize="small" />
                                        Follow
                                    </>
                                )}</span>
                            </button>
          
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Stats */}
            <div className="widgets__widgetContainer">
                <div className="widgets__widgetHeader">
                    <h2>Platform Stats</h2>
                </div>
                <div className="widgets__widgetContent">
                    <div className="widgets__stat">
                        <div className="widgets__statLabel">Total Sivs</div>
                        <div className="widgets__statValue">{platformStats.totalSivs}</div>
                    </div>
                    <div className="widgets__stat">
                        <div className="widgets__statLabel">Active Users</div>
                        <div className="widgets__statValue">{platformStats.activeUsers}</div>
                    </div>
                    <div className="widgets__stat">
                        <div className="widgets__statLabel">Polls Created</div>
                        <div className="widgets__statValue">{platformStats.pollsCreated}</div>
                    </div>
                    <div className="widgets__stat">
                        <div className="widgets__statLabel">Votes Cast</div>
                        <div className="widgets__statValue">{platformStats.votesCast}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Widgets;