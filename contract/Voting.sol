// SPDX-License-Identifier: MIT
//https://github.com/seresistvanandras/evoting https://github.com/kevinejohn/blind-signatures/ This contract is based on Seres' and Kevin's works. Credits and thanks to them. and also the paper Seres consulted from https://eprint.iacr.org/2017/1043.pdf .
// This code contains e-Voting Blind Signature on Ethereum Network(or EVM based)!
// Additionally to Seres' and Kevin's work, this code will contain Threshold Encryption.

pragma solidity ^ 0.8 .0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Voting is Ownable {

	struct Voter {
		bool isWhitelisted;
		uint256 blindedVote;
		uint256 approvedBlindedVoteByAuthority;
		string choice; // FB Is Fenerbahce , GS Is Galatasaray
	}

	uint256 public voteCount;

	mapping(address => Voter) public eligibleVoterList;
	mapping(address => uint256) public blindedVotes; //votes that are waiting for approval.
	address[] public voterAddresses; // for calculating results

	bool public isVotingLive;
	string[] public candidateCodeList = ["FB", "GS"];

	string public votingDetails = "Who will be the champion?";

	uint256 public publicModulo;
	uint256 public publicExponent;

	receive() external payable {
		revert("No direct Payments!");
	}

	fallback() external payable {
		revert("No direct Payments!");
	}

	constructor() { //string[] memory _candidateList) {
		voteCount = 0;
		isVotingLive = false;
		publicModulo = 63677237205737330755798088062174426175358873670261236803285663498937718073273;
		publicExponent = 65537;
	}

	modifier isVotingProcessLive() {
		require(isVotingLive == true, "Voting is not live");
		_;
	}

	function openCloseVoting() external onlyOwner {
		isVotingLive = !isVotingLive;
	}

	struct CandidateResultTemplate {
		string candidateName;
		uint256 votes;
	}

	function getAllVoters() internal view returns(Voter[] memory) {
		Voter[] memory voters = new Voter[](voterAddresses.length);
		for (uint i = 0; i < voterAddresses.length; i++) {
			address voterAddress = voterAddresses[i];
			voters[i] = eligibleVoterList[voterAddress];
		}
		return voters;
	}

	function checkStringsEqual(string memory _choice, string memory candidateName) internal pure returns(bool) { //change to internal
		return keccak256(abi.encodePacked(_choice)) == keccak256(abi.encodePacked(candidateName)) ? true : false;
	}

	function calculateResults() onlyOwner public view returns(CandidateResultTemplate[] memory) {
		CandidateResultTemplate[] memory resultTemplate = new CandidateResultTemplate[](candidateCodeList.length);
		Voter[] memory voters = getAllVoters();

		for (uint i = 0; i < voters.length; i++) {
			if (checkStringsEqual(voters[i].choice, candidateCodeList[0])) {
				resultTemplate[0].votes++;
			} else if (checkStringsEqual(voters[i].choice, candidateCodeList[1])) {
				resultTemplate[1].votes++;
			}
		}

		for (uint j = 0; j < candidateCodeList.length; j++) {
			resultTemplate[j].candidateName = candidateCodeList[j];
		}
		return resultTemplate;
	}


	function addEligibleVoter(address _voter) isVotingProcessLive onlyOwner public {
		require(!eligibleVoterList[_voter].isWhitelisted, "User is already whitelisted");
		eligibleVoterList[_voter].isWhitelisted = true;
	}

	function removeEligibleVoter(address _voter) isVotingProcessLive onlyOwner public {
		require(eligibleVoterList[_voter].isWhitelisted, "User is not whitelisted");
		eligibleVoterList[_voter].isWhitelisted = false;
	}

	event voteBlindedBlindSigPending(address indexed voter);

	function requestBlindSig(uint256 _blindedVote) isVotingProcessLive public {
		require(eligibleVoterList[msg.sender].isWhitelisted, "You are not whitelisted");
		blindedVotes[msg.sender] = _blindedVote;
		eligibleVoterList[msg.sender].isWhitelisted = false;
		eligibleVoterList[msg.sender].blindedVote = _blindedVote;
		emit voteBlindedBlindSigPending(msg.sender);
	}

	function writeBlindSig(address _voter, uint256 blindSig) onlyOwner public {
		eligibleVoterList[_voter].approvedBlindedVoteByAuthority = blindSig;
	}

	event voteSuccess(address indexed voter, uint256 hashOfVote);

	function Vote(string memory _choice, uint256 unblindedVoteHash, uint256 hashedMessage)
	isVotingProcessLive
	verifyBlindSig(unblindedVoteHash, hashedMessage)
	checkHashSums(_choice, hashedMessage)
	public {
		eligibleVoterList[msg.sender].choice = _choice;
		voteCount++;
		blindedVotes[msg.sender] = 0;
		voterAddresses.push(msg.sender);
		emit voteSuccess(msg.sender, unblindedVoteHash);
	}

	modifier verifyBlindSig(uint256 unblindedVoteHash, uint256 hashedMessage) {
		require(expmod(unblindedVoteHash, publicExponent, publicModulo) == hashedMessage, "Not valid!");
		_;
	}

	modifier checkHashSums(string memory _choice, uint256 sha256hashedMessage) {
		bytes32 choiceHash = sha256(abi.encodePacked(_choice));
		require(choiceHash == bytes32(sha256hashedMessage), "Hashed message does not match choice hash");
		_;
	}

	function expmod(uint256 base, uint256 exponent, uint256 modulus) public view returns(uint256 result) {
		assembly {
			// Free memory pointer
			let pointer:= mload(0x40)

			// Define length of base, exponent, and modulus
			mstore(pointer, 0x20)
			mstore(add(pointer, 0x20), 0x20)
			mstore(add(pointer, 0x40), 0x20)

			// Define variables base, exponent, and modulus
			mstore(add(pointer, 0x60), base)
			mstore(add(pointer, 0x80), exponent)
			mstore(add(pointer, 0xa0), modulus)

			// Store the result
			let value:= mload(0xc0)

			// Call the precompiled contract 0x05 = bigModExp
			if iszero(
				staticcall(
					not(0),
					0x05,
					pointer,
					0xc0,
					value,
					0x20
				)
			) {
				revert(0, 0)
			}
			result:= mload(value)
		}
	}

}
