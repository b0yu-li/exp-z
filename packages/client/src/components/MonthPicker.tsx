import { useState, useEffect, useRef } from "react";

interface MonthPickerProps {
    value: string; // Format: "YYYY-MM"
    onChange: (newValue: string) => void;
}

export const MonthPicker = ({ value, onChange }: MonthPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [year, setYear] = useState(parseInt(value.split('-')[0]));
    const containerRef = useRef<HTMLDivElement>(null);

    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Sync internal year state if external value changes
    useEffect(() => {
        setYear(parseInt(value.split('-')[0]));
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMonthSelect = (monthIndex: number) => {
        // Javascript months are 0-indexed, but ISO string needs 01-12
        const monthStr = (monthIndex + 1).toString().padStart(2, '0');
        onChange(`${year}-${monthStr}`);
        setIsOpen(false);
    };

    const currentSelectedMonthIndex = parseInt(value.split('-')[1]) - 1;
    const currentSelectedYear = parseInt(value.split('-')[0]);

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold tracking-wide
                    ${isOpen
                        ? 'bg-gray-700 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                    }`}
            >
                <span className="capitalize">
                    {new Date(value + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                {/* Chevron Icon */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">

                    {/* Year Header */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                        <button
                            onClick={() => setYear(y => y - 1)}
                            className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="font-bold text-white text-lg">{year}</span>
                        <button
                            onClick={() => setYear(y => y + 1)}
                            className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Months Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((month, index) => {
                            const isSelected = index === currentSelectedMonthIndex && year === currentSelectedYear;
                            return (
                                <button
                                    key={month}
                                    onClick={() => handleMonthSelect(index)}
                                    className={`py-2 text-sm rounded-md font-medium transition-all
                                        ${isSelected
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    {month}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};