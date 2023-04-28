import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="h-12 w-full flex flex-1 relative">
      <input
        className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
        type="text"
        placeholder="Enter a city to search"
      />
      <span className="absolute w-12 h-12 rounded-full flex items-center justify-center top-50 right-0 bg-dark text-smoke text-xl">
        <IoSearchOutline />
      </span>
    </div>
  );
};

export default SearchBar;
