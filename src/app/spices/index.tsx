import { useState } from 'react';
import SpicesFeed from '../../components/SpicesFeed';
import SearchIcon from '../../assets/images/search-icon.svg?react';

function Spices() {
  const [searchString, updateSearchString] = useState('');

  return (
    <div className="relative">
      <div className="fixed w-full h-24 border-b bg-white border-gray-4 flex items-center z-10">
        <SearchIcon className="h-5 w-5 my-8 ml-8 absolute" />
        <input
          className="h-full grow pl-14"
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
      </div>
      <div className="h-full min-h-screen pt-24 flex">
        <div className="grow">
          <SpicesFeed searchString={searchString} />
        </div>
      </div>
    </div>
  );
}

export default Spices;
