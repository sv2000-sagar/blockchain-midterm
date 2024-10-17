import React, { useState, useEffect } from "react";
import Web3 from "web3";
import cryptoZombiesABI from "../../../build/contracts/ZombieOwnership.json";
import Hero from "./scenes/hero";
import MockCryptoKittiesABI from "../../../build/contracts/MockCryptoKitties.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [cryptoZombies, setCryptoZombies] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [zombies, setZombies] = useState([]);
  const [txStatus, setTxStatus] = useState("");
  const [cryptoKitties, setCryptoKitties] = useState(null);
  const [otherZombies, setOtherZombies] = useState([]);

  const zombieImages = [
    "https://i.seadn.io/gae/8iv0bkuUPojb5_WQy7_Ay7tzrnpAKahjtmLYJyU_y_hy3O3OaRrjMhNAJwdYaBYk6Sb8VkKiZT5Ki7_2GMkGQ7g_YAvYGKor3bImFg?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/u23sKWUeMvBgsPOJdnGqA2y5okCBS917Z-8nQa-16z_01C3mS8OW8yBiw_irfzQtMMHoQ-SP2eoilwFpSdK_07au0ozZDcfOD2NNlA?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/HYrblIpjLPNhVhZBH5-eazII1HrPZJBmA8ytGoh0uW453sjZ2elltUyYT4mkYeh-xjgbYFcUYCRrgfiV7Hs9sVIInOSZjnlVp7cCXGk?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/bOyhc7Zvmy6P9NYD7FaklE_OE5VK3qzf5iczy73Ex798ybafNaGWiBsgxMySJTNb0RCJAVwlI8qBDcuPWR6d7KhvHf1XcgS760Jb?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/M5H1RV4ww_Uxd0c9Se8CmaEfsxNsqKAsFtFxVr9ebxP7S4QjlmCo3CDzAQoTdG_i_-b_MHF_uUQCGNT1C1qlHekDXIiFjVtBEbDS?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/flVm-FsMk5mztl2SQL8gY6ptmFOx_5KAh0r4UuTRTRNQpxlrAyKZozQEsCezwdk-zg3BJ-8fTM8JAF03_ywczuinKkk5GnFhe2_CVQ?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/sM8yxyhumWmqbSio3Xw1G9TRXtsFR1nTk8MEwNCMgfSTO8Q0_f-K-TuENNXnOE2IQWDXDluKv4GphPixVM6j4cDQfBfBvsedbKscU64?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/rEdWoyTTQjP8FZAuMYmeCA1aGjRw-YEDqalJrPwVU5NGaBebmiDpMX9V8UDMSRGTu--gw8L3Hn_mrdBGt1ZX9wIQEZY0zEXy0YMgBQ?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/JOzs-Bj1ktP7NYFLMFqIKAfQ9-Rb5EMIAqbxoxpm-zT6DdA_8JnrpxdN_cdec6aGeUhk3O-jrm_hkG9UX5QL0nIQE011R862VlLUqA?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/dTqdzXCFeIL_dw2zrxZxsK2UyZb6qWLCgQRV0e3OSHVXb-0a1iqK3uNdGD2Ks1wefLsXjYnBu9vXZ-CUUDFSdktG85eKOrz4sWHGKg?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/zKoVo5NtvD41bdoqyrVBB_cUx6fbyE5CxDvfd4k5itlOg96tVVy6cTFUcbhzizwUiR1bxvK4kvlxNKggp9wlQ_L2aFtjQRMKMRBv?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/bKuV4sM10buGphY_VFIWgWFxaxm2wriJfszx2uQr66l8aSjz-kAYA04xeHhJkw-tXq__nbyAjs-d-DVyWyhDWRABYrTIIEviSTzv?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/PUDZy9zRUEsycbg18aqChsUiceKPvpc95Uk6wm18NZqMyJgoPozkFr_KfFhMVOnx_20zCLfUVfr-77KI4Ta-or5T2hCXL-uN83e0?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/H4oIN7JjyZWFEVfsaDXlW0_dMMuEMtEsYmm5XG2xKJfqOr-zzix3i8cywnjbICFXkodxiH7yNOp-VKcJ8SwmPwDOZmHLg3eMkgv7sQ?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/16wsHqObKXZxokAX187xMEbA6zNIuwk-QeDQUz600v0y8BQRwhYHoROGbkyhuD8xNp2FBtzu1GWQEesMBBLUZYkhIyI-TNi8-5yh?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/-LcpkBtHCZzDt5rz7113nIsUd4IyoOIDanJEO5UZh65cfhOFePdv7M44LTGqji8ipFntgZLePaHS_57j1Uxtzd2nlf_NgxBw3SQZ4g?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/lpq3OmEf2wiRT2M-10AlRV5i325CyGQvxbwLUbPkymi6Gnwm4PoyOMEAdAZg9R1i5ZNl7wGEaFuChcqLMSrU7L3ys8NGB3An8yLD?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/7M30Tn719RiOrYkMypQnJYe5-Am8eKEh3AIW3ddYE7zHk0vWDSPUboskt4m6qm2WcwUNwqN_tjw6MoIuVP4MY7t5A93QfbAn-vnir9U?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/I4OGaMaBe8_gjjhZ91L2kMZSljNgWylrBbmWKp88dJXE0k2MiCC6wliH8gCFA5TBUr6NWAPRgQE6Nw4kgXtuWm1LtgTm7F0LRutZYw?auto=format&dpr=1&w=1000",
    "https://i.seadn.io/gae/aNuFdYIrwfpG1ieBYWqtWzunj8DNTFhn5__-qChB2wDSKz33xFyqqbH2s3Qc0z7jNlwZo4blcQe6nvJ_iYPu24qhp5xp-1JMq_AzgQ?auto=format&dpr=1&w=1000",
  ];

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setUserAccount(accounts[0]);

          // Get network ID
          const networkId = await web3Instance.eth.net.getId();

          // Declare variables at the correct scope
          let cryptoZombiesInstance;
          let mockCryptoKittiesInstance;

          // Initialize the CryptoZombies (ZombieOwnership) contract
          const cryptoZombiesDeployedNetwork =
            cryptoZombiesABI.networks[networkId];
          if (cryptoZombiesDeployedNetwork) {
            cryptoZombiesInstance = new web3Instance.eth.Contract(
              cryptoZombiesABI.abi,
              cryptoZombiesDeployedNetwork.address
            );
            setCryptoZombies(cryptoZombiesInstance);
            console.log("CryptoZombies instance:", cryptoZombiesInstance);
          } else {
            console.log(
              "CryptoZombies contract not deployed to the current network."
            );
          }

          // Initialize the MockCryptoKitties contract
          const deployedNetwork = MockCryptoKittiesABI.networks[networkId];
          if (deployedNetwork) {
            mockCryptoKittiesInstance = new web3Instance.eth.Contract(
              MockCryptoKittiesABI.abi,
              deployedNetwork.address
            );
            setCryptoKitties(mockCryptoKittiesInstance);
            console.log(
              "MockCryptoKitties instance:",
              mockCryptoKittiesInstance
            );
          } else {
            console.log(
              "MockCryptoKitties contract not deployed to the current network."
            );
          }

          // Event listener for account changes
          const handleAccountsChanged = async (accounts) => {
            if (accounts.length > 0) {
              setUserAccount(accounts[0]);

              if (cryptoZombiesInstance) {
                const ids = await getZombiesByOwner(
                  accounts[0],
                  cryptoZombiesInstance
                );
                displayZombies(ids, cryptoZombiesInstance);
              } else {
                console.log("CryptoZombies instance is not initialized.");
              }

              // Fetch zombies not owned by the user (for attacking)
              const otherZombieIds = await getZombiesNotOwnedBy(
                accounts[0],
                cryptoZombiesInstance
              );
              displayOtherZombies(otherZombieIds, cryptoZombiesInstance);
              console.log("other zombies details:", otherZombieIds);
            } else {
              console.log("Please connect to MetaMask.");
              setUserAccount(null);
              setZombies([]);
            }
          };

          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          // Fetch initial zombies
          if (cryptoZombiesInstance) {
            const ids = await getZombiesByOwner(
              accounts[0],
              cryptoZombiesInstance
            );
            displayZombies(ids, cryptoZombiesInstance);

            // Fetch and display zombies not owned by the current user for attacking
            const otherZombieIds = await getZombiesNotOwnedBy(
              accounts[0],
              cryptoZombiesInstance
            );
            displayOtherZombies(otherZombieIds, cryptoZombiesInstance);
            console.log("other zombies details:", otherZombieIds);
          } else {
            console.log("CryptoZombies instance is not initialized.");
          }

          // Cleanup function to remove event listeners
          return () => {
            if (window.ethereum.removeListener) {
              window.ethereum.removeListener(
                "accountsChanged",
                handleAccountsChanged
              );
            }
          };
        } catch (error) {
          console.error("Error during initialization:", error);
        }
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }

    init();
  }, []);

  async function getZombiesNotOwnedBy(owner, contractInstance) {
    // Fetch the total number of zombies from the contract
    const allZombiesCount = await contractInstance.methods.zombieCount().call(); // Query the zombieCount

    const zombiesNotOwnedByUser = [];

    // Iterate through all zombies to find the ones not owned by the current user
    for (let i = 0; i < allZombiesCount; i++) {
      const zombieOwner = await contractInstance.methods
        .zombieToOwner(i)
        .call();
      if (zombieOwner.toLowerCase() !== owner.toLowerCase()) {
        zombiesNotOwnedByUser.push(i);
      }
    }

    return zombiesNotOwnedByUser;
  }

  async function displayOtherZombies(ids, contractInstance) {
    const zombieDetails = await Promise.all(
      ids.map((id) => getZombieDetails(id, contractInstance))
    );
    setOtherZombies(zombieDetails);
  }

  async function attackZombie(myZombieId, targetZombieId) {
    if (myZombieId === targetZombieId) {
      setTxStatus("You can't attack your own zombie!");
      return;
    }

    setTxStatus("Attacking another zombie...");

    try {
      await cryptoZombies.methods
        .attack(myZombieId, targetZombieId)
        .send({ from: userAccount, gas: 300000 });

      setTxStatus("Attack completed!");
      // Refresh both zombies' data after the attack
      const myZombiesIds = await getZombiesByOwner(userAccount, cryptoZombies);
      displayZombies(myZombiesIds, cryptoZombies);

      const otherZombieIds = await getZombiesNotOwnedBy(
        userAccount,
        cryptoZombies
      );
      displayOtherZombies(otherZombieIds, cryptoZombies);
    } catch (error) {
      console.error("Error attacking zombie:", error);
      setTxStatus(error.message || "An error occurred during the attack.");
    }
  }

  async function getZombieDetails(id, contractInstance) {
    const zombieData = await contractInstance.methods.zombies(id).call();
    console.log("Zombie details:", zombieData);

    // Handle both object properties and array-like structures
    const zombie = {
      id: id,
      name: zombieData.name || zombieData[0],
      dna: zombieData.dna
        ? zombieData.dna.toString()
        : zombieData[1].toString(),
      level: zombieData.level
        ? zombieData.level.toString()
        : zombieData[2].toString(),
      readyTime: zombieData.readyTime
        ? zombieData.readyTime.toString()
        : zombieData[3].toString(),
      winCount: zombieData.winCount
        ? zombieData.winCount.toString()
        : zombieData[4].toString(),
      lossCount: zombieData.lossCount
        ? zombieData.lossCount.toString()
        : zombieData[5].toString(),
    };
    console.log("here");
    console.log(zombie.id);
    return zombie;
  }

  async function getZombiesByOwner(owner, contractInstance) {
    return await contractInstance.methods.getZombiesByOwner(owner).call();
  }

  async function displayZombies(ids, contractInstance) {
    const zombieDetails = await Promise.all(
      ids.map((id) => getZombieDetails(id, contractInstance))
    );
    setZombies(zombieDetails);
  }

  async function createRandomZombie(name) {
    setTxStatus(
      "Creating new zombie on the blockchain. This may take a while..."
    );
    try {
      await cryptoZombies.methods.createRandomZombie(name).send({
        from: userAccount,
        value: web3.utils.toWei("0.01", "ether"), // Include the required Ether
        gas: 3000000,
      });

      setTxStatus(`Successfully created ${name}!`);
      // Optionally, refresh the list of zombies after transfer
      const ids = await getZombiesByOwner(userAccount, cryptoZombies);
      displayZombies(ids, cryptoZombies);
    } catch (error) {
      console.error("Error creating zombie:", error);
      if (error && error.message) {
        setTxStatus(error.message);
      } else {
        setTxStatus("An error occurred while creating the zombie.");
      }
    }
  }

  async function levelUp(zombieId) {
    setTxStatus("Leveling up your zombie...");
    cryptoZombies.methods
      .levelUp(zombieId)
      .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
      .on("receipt", (receipt) => {
        setTxStatus("Power overwhelming! Zombie successfully leveled up");
        // Refresh zombie data
        getZombiesByOwner(userAccount, cryptoZombies).then((ids) => {
          displayZombies(ids, cryptoZombies);
        });
      })
      .on("error", (error) => {
        setTxStatus(error.message);
      });
  }

  async function feedOnKitty(zombieId, kittyId) {
    console.log("Feeding on Kitty:", zombieId, kittyId);

    try {
      if (!cryptoKitties) {
        setTxStatus("CryptoKitties contract not initialized.");
        return;
      }

      // Fetch and validate kitty data
      const kittyData = await cryptoKitties.methods.getKitty(kittyId).call();
      console.log("Kitty Data:", kittyData);

      if (
        !kittyData ||
        !kittyData.genes ||
        kittyData.genes === "0" ||
        kittyData.genes === "0n"
      ) {
        setTxStatus("Invalid Kitty ID or Kitty does not exist.");
        return;
      }

      // Check if zombie is ready
      const zombieData = await cryptoZombies.methods.zombies(zombieId).call();
      const zombieReadyTime = zombieData.readyTime;
      const currentTime = Math.floor(Date.now() / 1000);

      if (parseInt(zombieReadyTime) > currentTime) {
        setTxStatus(
          "Zombie is not ready yet. Please wait until the cooldown period is over."
        );
        return;
      }

      // Check zombie ownership
      const zombieOwner = await cryptoZombies.methods
        .zombieToOwner(zombieId)
        .call();
      if (zombieOwner.toLowerCase() !== userAccount.toLowerCase()) {
        setTxStatus("You do not own this zombie.");
        return;
      }

      setTxStatus("Eating a kitty. This may take a while...");

      await cryptoZombies.methods
        .feedOnKitty(zombieId, kittyId)
        .send({ from: userAccount, gas: 3000000 })
        .on("receipt", async function (receipt) {
          setTxStatus("Successfully fed on kitty!");
          // Refresh zombie data
          const ids = await getZombiesByOwner(userAccount, cryptoZombies);
          displayZombies(ids, cryptoZombies);
        })
        .on("error", function (error, receipt) {
          console.error("Error in transaction:", error);
          if (error && error.message) {
            setTxStatus("Error: " + error.message);
          } else {
            setTxStatus("An error occurred during the transaction.");
          }
        });
    } catch (error) {
      console.error("Error in feedOnKitty:", error);
      setTxStatus("Error: " + error.message);
    }
  }

  function simpleHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async function transferZombie(zombieId, recipientAddress) {
    setTxStatus("Transferring zombie...");

    try {
      // Assuming the user's address is set in userAccount
      await cryptoZombies.methods
        .transferFrom(userAccount, recipientAddress, zombieId)
        .send({ from: userAccount, gas: 300000 });

      setTxStatus("Zombie successfully transferred!");
      
      // After the transfer, refresh the user's zombies
      const myZombies = await getZombiesByOwner(userAccount, cryptoZombies);
      displayZombies(myZombies, cryptoZombies);

      // Refresh the list of zombies available to attack
      const otherZombies = await getZombiesNotOwnedBy(
        userAccount,
        cryptoZombies
      );
      displayOtherZombies(otherZombies, cryptoZombies);
    } catch (error) {
      console.error("Error transferring zombie:", error);
      setTxStatus(error.message || "An error occurred during the transfer.");
    }
  }

  return (
    <>
      <div className="App text-white bg-gray-900 md:px-20 lg:px-40 min-h-screen">
        <Hero />
        <div id="txStatus">{txStatus}</div>

        <div className="flex justify-center gap-10 text-2xl">
          <button
            className="createZombieButton bg-gradient-to-r from-cyan-500 text- to-teal-500 text-white px-4 py-0.5 border-none rounded-md"
            onClick={() => {
              const zombieName = prompt("Enter a name for your zombie");
              if (zombieName) {
                createRandomZombie(zombieName);
              }
            }}
          >
            Create Zombie
          </button>

          <button
            className="showZombieButton bg-gradient-to-r from-cyan-500 text- to-teal-500 text-white px-4 py-0.5 border-none rounded-md"
            onClick={async () => {
              const ids = await getZombiesByOwner(userAccount, cryptoZombies);
              displayZombies(ids, cryptoZombies);
            }}
          >
            Show Zombies
          </button>
        </div>

        <div id="zombies" className="flex flex-wrap">
          {zombies.map((zombie, index) => {
            const id = zombie.id.toString();
            const dnaStr = zombie.dna.toString();
            const dnaHash = simpleHash(dnaStr);
            const imageIndex = dnaHash % zombieImages.length;
            const zombieImage = zombieImages[imageIndex];
            console.log("final");
            console.log(id);
            return (
              <div key={index} className="basis-1/4 p-2 ">
                <div className="zombie pb-20 ">
                  <div className="border-4 border-white w-full max-w-sm rounded overflow-hidden shadow-lg bg-gradient-to-r from-cyan-500 to-teal-500 mt-5">
                    <img className="w-full" src={zombieImage} alt="Zombie" />
                    <div className="px-6 py-2 text-center">
                      <div className="font-bold text-2xl mb-2 text-center">
                        {zombie.name} (ID: {id})
                      </div>
                      <ul className="text-xl">
                        <li>DNA: {zombie.dna}</li>
                        <li>Level: {zombie.level}</li>
                        <li>Wins: {zombie.winCount}</li>
                        <li>Losses: {zombie.lossCount}</li>
                        <li>Ready Time: {zombie.readyTime}</li>
                      </ul>
                    </div>
                    <div className="text-center py-1 text-md">
                      <button
                        className="bg-black text-white px-4 py-0.5 border-none rounded-md"
                        onClick={() => levelUp(zombie.id)}
                      >
                        Level Up
                      </button>
                      <button
                        onClick={() => {
                          const kittyId = prompt("Enter Kitty ID to feed on");
                          if (kittyId) {
                            feedOnKitty(zombie.id, kittyId);
                          }
                        }}
                      >
                        Feed on Kitty
                      </button>

                      <button
                        onClick={() => {
                          const recipientAddress = prompt(
                            "Enter the recipient's address"
                          );
                          if (recipientAddress) {
                            transferZombie(zombie.id, recipientAddress);
                          }
                        }}
                        className="ml-2 bg-black text-white px-4 py-0.5 border-none rounded-md"
                      >
                        Transfer Zombie
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Other Zombies available for attack */}
        {otherZombies && (
          <>
            <h2 className="text-white text-4xl text-center">
              Available zombies to attack
            </h2>
            <div id="otherZombies" className="flex flex-wrap">
              {otherZombies.map((zombie, index) => {
                const dnaStr = zombie.dna.toString();
                const dnaHash = simpleHash(dnaStr);
                const imageIndex = dnaHash % zombieImages.length;
                const zombieImage = zombieImages[imageIndex];

                return (
                  <div key={index} className="basis-1/4 p-2">
                    <div className="zombie pb-20">
                      <div className="border-4 border-white w-full max-w-sm rounded overflow-hidden shadow-lg bg-gradient-to-r from-cyan-500 to-teal-500 mt-5">
                        <img
                          className="w-full"
                          src={zombieImage}
                          alt="Zombie"
                        />
                        <div className="px-6 py-2 text-center">
                          <div className="font-bold text-2xl mb-2 text-center">
                            {zombie.name}
                          </div>
                          <ul className="text-xl">
                            <li>DNA: {zombie.dna}</li>
                            <li>Level: {zombie.level}</li>
                            <li>Wins: {zombie.winCount}</li>
                            <li>Losses: {zombie.lossCount}</li>
                          </ul>
                          <button
                            className="bg-red-500 text-white px-4 py-1.5 mt-2 border-none rounded-md text-lg"
                            onClick={() => {
                              const myZombieId = prompt(
                                "Enter your zombie's ID to attack"
                              );
                              if (myZombieId) {
                                attackZombie(myZombieId, zombie.id);
                              }
                            }}
                          >
                            Attack This Zombie
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
