// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CelestialNFT is ERC721Enumerable, AccessControl, ERC721Holder {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public maxSupply = 1001;
    string public _baseTokenURI;

    address public metaMartianAddress;

    event Redeemed(uint256[] tokenIds, uint256 newId, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        address _metaMartianAddress
    ) ERC721(_name, _symbol) {
        _baseTokenURI = _uri;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        metaMartianAddress = _metaMartianAddress;
    }

    function mint(address to, uint256 id) external onlyRole(MINTER_ROLE) {
        _beforeMint(to, id);
        _mint(to, id);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, AccessControl) returns(bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint256[] memory tokensIds = new uint256[](tokenCount);
        for(uint i = 0; i < tokenCount; i++) {
            tokensIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensIds;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _beforeMint(address /* to */, uint256 /* id */) internal {
        require(totalSupply() <= maxSupply, "Cannot mint more than maxSupply");
    }

    function redeem(uint256[] memory tokenIds, uint256 _newId) public {
        require(tokenIds.length == 4, "Need four MetaMartianNFTs to redeem");
        for(uint i = 0;i < 4;i++) {
            IERC721(metaMartianAddress).safeTransferFrom(msg.sender, address(this), tokenIds[i]);
        }
        _mint(msg.sender, _newId);
        emit Redeemed(tokenIds, _newId, msg.sender);
    }

    function withdraw(uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(IERC721(metaMartianAddress).ownerOf(tokenId) == address(this), "TokenId not exist");
        IERC721(metaMartianAddress).safeTransferFrom(address(this), msg.sender, tokenId);
    }

}