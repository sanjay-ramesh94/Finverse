import { createContext, useContext, useState, useEffect } from "react";

const CURRENCIES = [
    { code: "INR", symbol: "₹", label: "Indian Rupee" },
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "GBP", symbol: "£", label: "British Pound" },
    { code: "JPY", symbol: "¥", label: "Japanese Yen" },
    { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
];

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
    const [currency, setCurrencyState] = useState(() => {
        const saved = localStorage.getItem("fv_currency");
        return saved ? JSON.parse(saved) : CURRENCIES[0];
    });

    const setCurrency = (c) => {
        setCurrencyState(c);
        localStorage.setItem("fv_currency", JSON.stringify(c));
    };

    const fmt = (amount) => `${currency.symbol}${Number(amount).toLocaleString("en-IN")}`;

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, currencies: CURRENCIES, fmt }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
