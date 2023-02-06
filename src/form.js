import { NFTStorage } from "nft.storage";
import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "./meta.json";
function NftMinter() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [metadata, setMetadata] = useState("");
  const [buttonText, setButtonText] = useState("Upload to IPFS");
  const [uploadedToIPFS, setUploadedToIPFS] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonText("Uploading to IPFS....");
    const client = new NFTStorage({ token: process.env.REACT_APP_NFT_KEY });
    const nft = await client.store({
      name: name,
      description: description,
      image,
    });
    setMetadata(nft.url);
    setUploadedToIPFS(true);
    setButtonText("Successful");
  };
  const { config } = usePrepareContractWrite({
    address: "0x04796d59962A595e9dc24be912E6Ec8263247be8",
    abi: abi.abi,
    functionName: "mintToken",
    args: [metadata],
  });

  const { data, writeAsync } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="bg-black h-[100vh] w-full flex flex-col justify-center items-center">
      {" "}
      <ConnectKitButton />
      <div className="p-6 mt-[10px] bg-white rounded-lg shadow-lg w-[50%]">
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="w-full p-3 border border-gray-400 rounded-lg"
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="w-full p-3 border border-gray-400 rounded-lg"
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="image"
          >
            Image
          </label>
          <input
            className="w-full p-3 border border-gray-400 rounded-lg"
            type="file"
            id="image"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        {!uploadedToIPFS ? (
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-indigo-600"
            onClick={(e) => {
              e.preventDefault();
              writeAsync();
            }}
          >
            {isLoading ? `Minting` : `Mint`}
          </button>
        )}

        {isSuccess && (
          <div>
            Successfully minted your NFT!
            <div>
              <a
                className="text-green-500"
                href={`https://explorer-liberty20.shardeum.org/transaction/${data?.hash}`}
              >
                View on Explorer
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NftMinter;
