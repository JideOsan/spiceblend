import { useState, useEffect, ReactElement } from 'react';
import SearchIcon from '../assets/images/search-icon.svg?react';
import AddIcon from '../assets/images/plus-icon.svg?react';

interface FeedWithSearchProps {
  searchSessionKey: string;
  children: (props: { searchString: string }) => ReactElement;
}

const FeedWithSearch: React.FC<FeedWithSearchProps> = ({
  searchSessionKey,
  children,
}) => {
  const savedSearch = sessionStorage.getItem(searchSessionKey) || '';
  const [searchString, updateSearchString] = useState(savedSearch);

  useEffect(() => {
    sessionStorage.setItem(searchSessionKey, searchString);
  }, [searchString, searchSessionKey]);

  return (
    <div className="relative flex flex-col h-screen">
      <div className="absolute top-0 left-0 right-0 h-24 border-b bg-white border-gray-200 flex items-center z-10">
        <SearchIcon className="h-5 w-5 my-8 ml-8 absolute" />
        <input
          className="h-full pl-14 grow"
          name={searchSessionKey}
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
        <button className="mx-6 bg-teal-500 text-white flex items-center text-sm h rounded-full py-3.5 px-6">
          <AddIcon className="h-4 w-4 mr-4" />
          Create Blend
        </button>
      </div>
      <div className="grow overflow-y-auto pt-24">
        {typeof children === 'function' ? children({ searchString }) : children}
      </div>
    </div>
  );
};

export default FeedWithSearch;
