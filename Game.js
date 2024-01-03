import React, { useState, useEffect } from "react";
import './Game.css';

const Game = () => {
  const [pot, setPot] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [tickets, setTickets] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      drawWinner();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleBuyTickets = () => {
    const ticketPrice = 10; // Assuming each ticket costs $10
    const serviceFeePercent = 0.5; // 0.5% service fee
    const serviceFee = (ticketPrice * tickets * serviceFeePercent) / 100;
    const totalCost = ticketPrice * tickets - serviceFee;

    setPot(pot + totalCost);

    const newTickets = (players[playerName] || 0) + parseInt(tickets);
    setPlayers({ ...players, [playerName]: newTickets });
  };

  const startCountdown = () => {
    setCountdown(30);
  };

  const resetGame = () => {
    setPot(0);
    setPlayers({});
    setWinner(null);
    setCountdown(null);
  };

  const drawWinner = () => {
    let allTickets = [];
    Object.keys(players).forEach((player) => {
      for (let i = 0; i < players[player]; i++) {
        allTickets.push(player);
      }
    });

    if (allTickets.length > 0) {
      const randomIndex = Math.floor(Math.random() * allTickets.length);
      setWinner(allTickets[randomIndex]);
    } else {
      setWinner(null);
    }
  };

  const renderPlayerTable = () => {
    const playerEntries = Object.entries(players);
    if (playerEntries.length === 0) {
      return <div>No tickets purchased yet.</div>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Tickets Purchased</th>
          </tr>
        </thead>
        <tbody>
          {playerEntries.map(([player, numTickets]) => (
            <tr key={player}>
              <td>{player}</td>
              <td>{numTickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="Game">
      <div>Current Pot: ${pot}</div>
      {countdown !== null && <div>Time left: {countdown}s</div>}
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Tickets"
        value={tickets}
        onChange={(e) => setTickets(e.target.value)}
      />
      <button onClick={handleBuyTickets}>Buy Tickets</button>
      <button onClick={startCountdown}>Start Countdown</button>
      <button onClick={resetGame}>Reset Game</button>
      {winner && <div>Winner: {winner}</div>}
      {renderPlayerTable()}
    </div>
  );
};

export default Game;
