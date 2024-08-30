
import { useEffect, useState } from 'react';

export const useSymbols = () => {
    const [symbols, setSymbols] = useState(['√', '^', 'π']);
    const [newSymbol, setNewSymbol] = useState('');

    useEffect(() => {
        const storedSymbols = localStorage.getItem('symbols');
        if (storedSymbols) {
            setSymbols(JSON.parse(storedSymbols));
        }
    }, []);

    const handleAddSymbol = () => {
        if (newSymbol.trim() !== '') {
            const updatedSymbols = [...symbols, newSymbol];
            setSymbols(updatedSymbols);
            localStorage.setItem('symbols', JSON.stringify(updatedSymbols));
            setNewSymbol('');
        }
    };

    const handleCopySymbol = (symbol) => {
        navigator.clipboard.writeText(symbol);
    };

    const handleDeleteSymbol = (index) => {
        const updatedSymbols = symbols.filter((_, i) => i !== index);
        localStorage.setItem('symbols', JSON.stringify(updatedSymbols));
        setSymbols(updatedSymbols);
    };

    return {
        symbols,
        newSymbol,
        setNewSymbol,
        handleAddSymbol,
        handleCopySymbol,
        handleDeleteSymbol
    };
};
