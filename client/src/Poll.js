import React, { useState, useEffect } from 'react';
import './Poll.css';
import { Button } from '@mui/material';

function Poll({ question, options, votes = {}, onVote, userHasVoted = false, pollId }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [localVotes, setLocalVotes] = useState(votes);

  // Update local votes when votes prop changes
  useEffect(() => {
    setLocalVotes(votes);
  }, [votes]);

  const handleVote = () => {
    if (selectedOption && onVote) {
      // Update local state immediately for better UX
      setLocalVotes(prev => ({
        ...prev,
        [selectedOption]: (prev[selectedOption] || 0) + 1
      }));
      onVote(pollId, selectedOption);
    }
  };

  const getTotalVotes = () => {
    return Object.values(localVotes).reduce((total, count) => total + count, 0);
  };

  const getPercentage = (option) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round(((localVotes[option] || 0) / total) * 100);
  };

  return (
    <div className="poll">
      <div className="poll__question">
        <h4>{question}</h4>
      </div>
      
      <div className="poll__options">
        {options.map((option, index) => (
          <div key={index} className="poll__option">
            {!userHasVoted ? (
              <label className="poll__optionLabel">
                <input
                  type="radio"
                  name={`poll-${pollId}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <span className="poll__optionText">{option}</span>
              </label>
            ) : (
              <div className="poll__result">
                <div className="poll__resultText">
                  <span>{option}</span>
                  <span className="poll__percentage">{getPercentage(option)}%</span>
                </div>
                <div className="poll__bar">
                  <div 
                    className="poll__barFill" 
                    style={{ width: `${getPercentage(option)}%` }}
                  />
                </div>
                <div className="poll__voteCount">{localVotes[option] || 0} votes</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!userHasVoted && (
        <Button
          onClick={handleVote}
          disabled={!selectedOption}
          className="poll__voteButton"
          variant="contained"
        
        >
          Vote
        </Button>
      )}

      <div className="poll__footer">
        <span className="poll__totalVotes">{getTotalVotes()} total votes</span>
      </div>
    </div>
  );
}

export default Poll;
