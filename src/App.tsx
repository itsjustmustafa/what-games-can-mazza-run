import React, { useState, useEffect } from 'react'
import './App.css'
import jsonData from './data/what_can_i_run_data_april_2024.json';
import Game from './types';
import GameTable from './GameTable';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(jsonData.results);
  }, [])

  const goToMyGitHub = () => {
    window.open("https://github.com/itsjustmustafa/what-games-can-mazza-run");
  }

  const handleSearch = (query: string) => {
    const filteredGames = jsonData.results.filter(game =>
      game.game.toLowerCase().includes(query.toLowerCase())
    );
    setGames(filteredGames);
  }
  const LogoImage = () => (
    <img src="/headphone_hmm.svg"
      className='logo'
      onClick={goToMyGitHub} />
  );

  return (
    <div>
      <div
        style={{ display: "flex", placeContent: "center", alignItems: "center" }}>
        <LogoImage />
        <h1 style={{ display: "inline" }}>
          What games can Mazza run?
        </h1>
        <LogoImage />
      </div>

      <GameTable games={games} onSearch={handleSearch} />
    </div >
  );
}

export default App
