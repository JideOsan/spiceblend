import { useState, useEffect } from 'react';
import BlendsFeed from '../../components/BlendsFeed';
import SearchIcon from '../../assets/images/search-icon.svg?react';

function Blends() {
  const savedSearch = sessionStorage.getItem('spices-search') || '';
  const [searchString, updateSearchString] = useState(savedSearch);

  useEffect(() => {
    sessionStorage.setItem('spices-search', searchString);
  }, [searchString]);

  return (
    <div className="relative">
      <div className="fixed w-full h-24 border-b bg-white border-gray-200 flex items-center z-10">
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
          <BlendsFeed searchString={searchString} />
        </div>
      </div>
    </div>
  );
}

export default Blends;
