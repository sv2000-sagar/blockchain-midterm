import React, { useState, useEffect } from "react";

function Leaderboard({ cryptoZombies, web3 }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cryptoZombies) {
      fetchLeaderboard();
    }
  }, [cryptoZombies]);

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      const zombieCount = await cryptoZombies.methods.zombieCount().call();
      const zombies = [];

      for (let i = 0; i < zombieCount; i++) {
        const zombie = await cryptoZombies.methods.zombies(i).call();
        const winCount = parseInt(zombie.winCount);
        const lossCount = parseInt(zombie.lossCount);
        const battles = parseInt(zombie.totalBattles);
        const ratio = lossCount === 0 ? winCount : winCount / lossCount;
        zombies.push({ ...zombie, id: i, winCount, lossCount, ratio, battles });
      }

      // Sort zombies by win/loss ratio
      zombies.sort((a, b) => b.ratio - a.ratio);
      setLeaderboard(zombies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  }

  return (
    <div className="leaderboard bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-3xl mb-4 text-center">Zombie Leaderboard</h2>
      {loading ? (
        <p className="text-white text-center">Loading leaderboard...</p>
      ) : (
        <div className="overflow-auto max-h-96">
          <table className="w-full text-white text-lg">
            <thead>
              <tr>
                <th className="p-2">Rank</th>
                <th className="p-2">Name</th>
                <th className="p-2">Battles</th>
                <th className="p-2">Wins</th>
                <th className="p-2">Losses</th>
                <th className="p-2">Win/Loss Ratio</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((zombie, index) => (
                <tr key={zombie.id} className="text-center border-b border-gray-700">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{zombie.name}</td>
                  <td className="p-2">{zombie.battles}</td>
                  <td className="p-2">{zombie.winCount}</td>
                  <td className="p-2">{zombie.lossCount}</td>
                  <td className="p-2">{zombie.ratio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
