import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Open this select menu');
    const [statusClass, setStatusClass] = useState(''); // New state for class
    const [focusedIndex, setFocusedIndex] = useState(0);
    const selectButtonRef = useRef(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            setFocusedIndex(0); // Reset focus to the first option when dropdown opens
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedValue(option.label); // Set selected value to label
        setIsOpen(false);
        setFocusedIndex(0); // Reset focus index

        // Determine and set status class based on selected option value
        setStatusClass(getStatusClass(option.value));
    };

    const getStatusClass = (value) => {
        switch (value) {
            case "completed":
                return 'ps-complete-bg';
            case "ongoing":
                return 'ps-process-bg';
            case "canceled":
                return 'ps-cancel-bg';
            case "pending":
                return 'ps-pending-bg';
            default:
                return 'status-unknown';
        }
    };

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex((prevIndex) =>
                    prevIndex < options.length - 1 ? prevIndex + 1 : 0
                );
                if (!isOpen) {
                    toggleDropdown();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : options.length - 1
                );
                if (!isOpen) {
                    toggleDropdown();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen) {
                    handleOptionSelect(options[focusedIndex]);
                } else {
                    toggleDropdown();
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                selectButtonRef.current && !selectButtonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="custom-select">
            <button
                ref={selectButtonRef}
                className={`select-button ${statusClass}`} // Apply the determined class here
                role="combobox"
                aria-label="select button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
            >
                <span className="selected-value">{selectedValue}</span>
                <span className="arrow"></span>
            </button>
            {isOpen && (
                <ul
                    ref={dropdownRef}
                    className="select-dropdown"
                    role="listbox"
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            role="option"
                            onClick={() => handleOptionSelect(option)}
                            className={`dropdown-option ${focusedIndex === index ? 'focused' : ''}`}
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    handleOptionSelect(option);
                                }
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;