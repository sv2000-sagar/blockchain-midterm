pragma solidity ^0.4.25;

import "./zombieattack.sol";
import "./ERC721.sol";
import "./safemath.sol";

contract ZombieOwnership is ZombieAttack, ERC721 {
    using SafeMath for uint256;

     // Define the onlyOwnerOf modifier here
    modifier onlyOwnerOf(uint _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId], "You must own this zombie.");
        _;
    }

    mapping(uint => address) zombieApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return zombieToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        require(_to != address(0)); // Prevent transfer to the zero address
        ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
        ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
        zombieToOwner[_tokenId] = _to;
        zombieApprovals[_tokenId] = address(0); // Clear approvals after transfer
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        require(
            zombieToOwner[_tokenId] == msg.sender ||
            zombieApprovals[_tokenId] == msg.sender,
            "Caller is not owner nor approved"
        );
        require(_to != address(0)); // Prevent transfer to the zero address
        _transfer(_from, _to, _tokenId);
    }

    function approve(
        address _approved,
        uint256 _tokenId
    ) external payable onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function getTopZombies() public view returns (uint[] memory) {
        uint length = zombies.length;
        uint[] memory topZombies = new uint[](length);

        // Fill the array with zombie IDs.
        for (uint i = 0; i < length; i++) {
            topZombies[i] = i;
        }

        // Sort the array based on win/loss ratio.
        // If a zombie has 0 losses, consider it as a high rank (undefeated).
        for (uint k = 0; k < length - 1; k++) {
            for (uint j = k + 1; j < length; j++) {
                uint winsA = zombies[topZombies[k]].winCount;
                uint lossesA = zombies[topZombies[k]].lossCount;
                uint winsB = zombies[topZombies[j]].winCount;
                uint lossesB = zombies[topZombies[j]].lossCount;

                // Calculate win/loss ratios (handle division by zero).
                uint ratioA = (lossesA == 0) ? winsA * 100 : (winsA * 100) / lossesA;
                uint ratioB = (lossesB == 0) ? winsB * 100 : (winsB * 100) / lossesB;

                // Sort in descending order of win/loss ratio.
                if (ratioB > ratioA) {
                    uint temp = topZombies[k];
                    topZombies[k] = topZombies[j];
                    topZombies[j] = temp;
                }
            }
        }

        return topZombies;
    }
}
