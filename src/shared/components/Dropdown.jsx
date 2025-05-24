import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useRef } from "react";
import { useState } from "react";

export default function Dropdown({ text, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleDropdownClick = () => {
    setIsOpen((state) => !state);
  };

  const handleOptionClick = (handler) => {
    setIsOpen(false);
    handler();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div
        onClick={handleDropdownClick}
        className="text-red-900 flex flex-row gap-1 cursor-pointer"
      >
        <div>{text}</div>
        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-8 right-2 bg-white border border-gray-300 shadow-md py-2 rounded-md"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="bg-white px-6 py-2 hover:bg-red-900 hover:text-white/90 duration-200 cursor-pointer"
              onClick={() => handleOptionClick(option.handler)}
            >
              option.text
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
