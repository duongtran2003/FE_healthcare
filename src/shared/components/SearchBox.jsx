import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function SearchBox({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(searchValue);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full bg-gray-200 rounded-sm px-8 py-3 flex flex-row gap-3">
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        className="outline-none px-4 py-1 bg-white rounded-sm border border-gray-200 hover:border-blue-900 focus:border-blue-900 duration-200 flex-1"
      />
      <button type="submit" className="bg-red-800 flex justify-center items-center text-white px-4 rounded-sm hover:bg-red-900 cursor-pointer duration-100">
        <SearchIcon />
      </button>
    </form>
  );
}
