import React, { useEffect, useState } from "react";
import Game from './types';
import SearchBar from './SearchBar';


interface GameTableProp {
    games: Game[],
    onSearch: (query: string) => void;
}

const getGameResult = (game: Game) => {
    return game.minResult === "FAIL" ? 'none' : game.recResult !== "FAIL" ? 'recommended' : 'minimum';
}

const getPassSymbol = (game: Game) => {
    switch (getGameResult(game)) {
        case 'recommended': return 'Recommended specs'
        case 'minimum': return 'Minimum specs'
        default: return 'Nope'
    }
}
const getResultStyleClass = (game: Game) => {
    switch (getGameResult(game)) {
        case 'recommended': return 'result-rec'
        case 'minimum': return 'result-min'
        default: return 'result-fail'
    }
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
                    <th>Can I?</th>
                </tr>
            </thead>
            <tbody>
                {sortedGames.map(game => (
                    <tr key={game.id}>
                        <td
                            style={{ width: "50%" }}
                        >{game.game}</td>
                        <td
                            style={{ width: "50%" }}
                            className={"result " + getResultStyleClass(game)}>
                            {getPassSymbol(game)}
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