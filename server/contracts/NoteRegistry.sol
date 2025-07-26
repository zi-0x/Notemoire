// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NoteRegistry {
    struct Note {
        string cid;
        address author;
        uint timestamp;
    }

    Note[] public notes;

    event NoteUploaded(string cid, address indexed author, uint timestamp);

    function uploadNote(string calldata cid) external {
        notes.push(Note(cid, msg.sender, block.timestamp));
        emit NoteUploaded(cid, msg.sender, block.timestamp);
    }

    function getAllNotes() external view returns (Note[] memory) {
        return notes;
    }
}
