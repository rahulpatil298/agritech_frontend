import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import FarmerMarketplace from "./contracts/FarmerMarketplace.json"; // Ensure this ABI file is present

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [account, setAccount] = useState("");
  const [crops, setCrops] = useState([]);



  const recognition = new window.webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

function startListening() {
  recognition.start();
}

recognition.onresult = (event) => {
  const speechText = event.results[0][0].transcript;
  console.log("Recognized text:", speechText);
};


<button onClick={startListening} className="bg-blue-500 text-white p-2 rounded">🎤 Speak</button>
function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    console.log("Image uploaded:", reader.result);
  };
  reader.readAsDataURL(file);
}

<input type="file" onChange={handleImageUpload} className="mt-2" />

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FarmerMarketplace.abi, signer);

      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const cropCount = await contract.cropCount();
      let items = [];
      for (let i = 1; i <= cropCount; i++) {
        const crop = await contract.crops(i);
        items.push({
          id: crop.id.toNumber(),
          price: ethers.utils.formatEther(crop.price),
          image: crop.image,
          sold: crop.sold,
        });
      }
      setCrops(items);
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Farmer Marketplace</h1>
      <p>Connected Account: {account}</p>
      <div className="grid grid-cols-3 gap-4">
        {crops.map((crop) => (
          <div key={crop.id} className="border p-4">
            <img src={crop.image} alt="Crop" className="w-full h-40 object-cover" />
            <p>Price: {crop.price} ETH</p>
            <button className="bg-green-500 text-white p-2 rounded mt-2">Buy Crop</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
