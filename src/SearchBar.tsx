import React, { useEffect, useState } from 'react';

interface SearchBarProp {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProp> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        onSearch(query);
    }, [query])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    return (
        <div id="searchbar-container">
            <input type="text" id="searchbar" onChange={handleChange} placeholder='Search game...' />
        </div>
    );
}

export default SearchBar;