import React, { useEffect, useState } from "react";
import Game from './types';
import SearchBar from './SearchBar';


interface GameTableProp {
    games: Game[],
    onSearch: (query: string) => void;
}

const getPassSymbol = (result: string) => {
    return result === "PASS" ? '✔' : ' ';
}
const getResultStyleClass = (result: string) => {
    return result === "PASS" ? 'result-pass' : 'result-fail';
}
const GameTable: React.FC<GameTableProp> = ({ games, onSearch }) => {
    const defaultTotalLoaded = 100;
    const loadIncrement = 50;
    const [totalLoaded, setTotalLoaded] = useState<number>(defaultTotalLoaded);

    const sortedGames = games.slice().sort(
        (a, b) => b.PopCount - a.PopCount
    ).slice(0, totalLoaded);

    const incrementTotalLoaded = () => {
        if (games.length > totalLoaded) {
            setTotalLoaded(prevTotalLoaded => prevTotalLoaded + loadIncrement);
        }
    }

    useEffect(() => {
        setTotalLoaded(Math.min(defaultTotalLoaded, games.length));
    }, [games])

    return (
        <table>
            <thead>
                <tr className="searchBarRow">
                    <th colSpan={3}><SearchBar onSearch={onSearch} /></th>
                </tr>
                <tr className="titleRow">
                    <th>Game</th>
                    <th>Minimum</th>
                    <th>Recommended</th>
                </tr>
            </thead>
            <tbody>
                {sortedGames.map(game => (
                    <tr key={game.id}>
                        <td
                            style={{ width: "50%" }}
                        >{game.game}</td>
                        <td
                            style={{ width: "25%" }}
                            className={getResultStyleClass(game.minResult)}>
                            {getPassSymbol(game.minResult)}
                        </td>
                        <td
                            style={{ width: "25%" }}
                            className={getResultStyleClass(game.recResult)}>
                            {getPassSymbol(game.recResult)}
                        </td>
                    </tr>
                ))}
                <tr>
                    {(games.length > totalLoaded) && <td colSpan={3} id="increment" onClick={incrementTotalLoaded}>
                        (Show more...)
                    </td>}
                </tr>
            </tbody>
        </table>
    );
}

export default GameTable;