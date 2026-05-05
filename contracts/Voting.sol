// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @notice Minimal on-chain voting: fixed list of candidates, one vote per address.
 */
contract Voting {
    // Fixed at deploy: exactly 2 or 3 candidate names
    string[] private _candidates;

    // Whether an address has already voted
    mapping(address => bool) public hasVoted;

    // Vote count per candidate index
    mapping(uint256 => uint256) private _votes;

    /**
     * @param candidateNames Must be length 2 or 3 only (project requirement).
     */
    constructor(string[] memory candidateNames) {
        require(
            candidateNames.length == 2 || candidateNames.length == 3,
            "Need 2 or 3 candidates"
        );
        _candidates = candidateNames;
    }

    /**
     * @notice Cast one vote for candidate at `candidateIndex` (0-based).
     */
    function vote(uint256 candidateIndex) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateIndex < _candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        _votes[candidateIndex]++;
    }

    /**
     * @notice Returns vote counts in the same order as candidates.
     */
    function getResults() external view returns (uint256[] memory counts) {
        uint256 len = _candidates.length;
        counts = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            counts[i] = _votes[i];
        }
    }

    /**
     * @notice Candidate names for the UI.
     */
    function getCandidates() external view returns (string[] memory) {
        return _candidates;
    }

    /**
     * @notice How many candidates (2 or 3).
     */
    function candidateCount() external view returns (uint256) {
        return _candidates.length;
    }
}
