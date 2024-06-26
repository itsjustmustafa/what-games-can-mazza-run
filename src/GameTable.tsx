import React, { useEffect, useState, useRef } from "react";
import Game from "./types";
import SearchBar from "./SearchBar";

interface GameTableProp {
  games: Game[];
  onSearch: (query: string) => void;
}

const getGameResult = (game: Game) => {
  return game.minResult === "FAIL"
    ? "none"
    : game.recResult !== "FAIL"
      ? "recommended"
      : "minimum";
};

const getPassSymbol = (game: Game) => {
  switch (getGameResult(game)) {
    case "recommended":
      return "Recommended specs";
    case "minimum":
      return "Minimum specs";
    default:
      return "Nope";
  }
};
const getResultStyleClass = (game: Game) => {
  switch (getGameResult(game)) {
    case "recommended":
      return "result-rec";
    case "minimum":
      return "result-min";
    default:
      return "result-fail";
  }
};
const GameTable: React.FC<GameTableProp> = ({ games, onSearch }) => {
  const defaultTotalLoaded = 100;
  const loadIncrement = 50;
  const [totalLoaded, _setTotalLoaded] = useState<number>(defaultTotalLoaded);
  const totalLoadedRef = useRef(totalLoaded);
  const setTotalLoaded = (
    totalLoadedUpdate: (prevTotalLoaded: number) => number
  ) => {
    totalLoadedRef.current = totalLoadedUpdate(totalLoadedRef.current);
    _setTotalLoaded(totalLoadedUpdate);
  };

  const gamesLengthRef = useRef(games.length);

  useEffect(() => {
    const bottomRowElement = document.getElementById("end-of-table");
    const observerOptions = {
      threshold: 1.0,
    };
    const observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        incrementTotalLoaded();
      }
    }, observerOptions);
    if (bottomRowElement) {
      observer.observe(bottomRowElement);
    }
    return () => {
      if (bottomRowElement) {
        observer.unobserve(bottomRowElement);
      }
    };
  }, []);

  const sortedGames = games
    .slice()
    .sort((a, b) => b.PopCount - a.PopCount)
    .slice(0, totalLoadedRef.current);

  const incrementTotalLoaded = () => {
    if (gamesLengthRef.current > totalLoadedRef.current) {
      setTotalLoaded((prevTotalLoaded) => prevTotalLoaded + loadIncrement);
    }
  };

  useEffect(() => {
    setTotalLoaded((_) => Math.min(defaultTotalLoaded, games.length));
    gamesLengthRef.current = games.length;
  }, [games]);

  return (
    <>
      <table id="gametable">
        <thead>
          <tr className="searchBarRow">
            <th colSpan={3}>
              <SearchBar onSearch={onSearch} />
            </th>
          </tr>
          <tr className="titleRow">
            <th>Games</th>
            <th>Can I?</th>
          </tr>
        </thead>
        <tbody>
          {sortedGames.map((game) => (
            <tr key={game.id}>
              <td style={{ width: "50%" }}>{game.game}</td>
              <td
                style={{ width: "50%" }}
                className={"result " + getResultStyleClass(game)}
              >
                {getPassSymbol(game)}
              </td>
            </tr>
          ))}
          <tr>
            {games.length > totalLoaded && (
              <td colSpan={3} id="increment" onClick={incrementTotalLoaded}>
                (Show more...)
              </td>
            )}
          </tr>
          {games.length == 0 && <td colSpan={3}> No games found... </td>}
        </tbody>
      </table>
      <div
        id="end-of-table"
        style={{
          height: "0px",
        }}
      ></div>
    </>
  );
};

export default GameTable;
