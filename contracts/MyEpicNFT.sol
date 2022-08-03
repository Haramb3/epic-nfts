// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RandomNounsNFT", "RANDNOUNS") {
        console.log("This is an NFT Contract");
    }

    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [
        "Success",
        "Addition",
        "Pollution",
        "Decision",
        "Foundation",
        "Marketing",
        "Stranger",
        "Television",
        "Information",
        "Supermarket"
    ];
    string[] secondWords = [
        "Difficulty",
        "Loss",
        "Topic",
        "Insect",
        "Lake",
        "Phone",
        "Ear",
        "Recognition",
        "Depression",
        "Month"
    ];

    string[] thirdWords = [
        "Baseball",
        "Profession",
        "Tennis",
        "Agency",
        "Employee",
        "Hotel",
        "Beer",
        "Complaint",
        "Shopping",
        "Imagination"
    ];

    function pickRandomName(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 randOne = uint256(
            keccak256(
                abi.encodePacked(
                    string(
                        abi.encodePacked(
                            "FIRST_WORD",
                            Strings.toString(tokenId)
                        )
                    )
                )
            )
        );
        uint256 randTwo = uint256(
            keccak256(
                abi.encodePacked(
                    string(
                        abi.encodePacked(
                            "SECOND_WORD",
                            Strings.toString(tokenId)
                        )
                    )
                )
            )
        );
        uint256 randThree = uint256(
            keccak256(
                abi.encodePacked(
                    string(
                        abi.encodePacked(
                            "THIRD_WORD",
                            Strings.toString(tokenId)
                        )
                    )
                )
            )
        );
        randOne = randOne % firstWords.length;
        randTwo = randTwo % secondWords.length;
        randThree = randThree % thirdWords.length;
        return
            string(
                abi.encodePacked(
                    firstWords[randOne],
                    secondWords[randTwo],
                    thirdWords[randThree]
                )
            );
    }

    function makeAnEpicNFT() public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        string memory word = pickRandomName(newItemId);

        string memory finalSvg = string(
            abi.encodePacked(baseSvg, word, "</text></svg>")
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        word,
                        '", "description": "NFT Collection of randomly generated nouns", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data.
        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
    }
}
