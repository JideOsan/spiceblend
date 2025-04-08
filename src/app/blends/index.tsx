import BlendsFeed from '../../components/BlendsFeed';
import SearchableLayout from '../../layouts/SearchableLayout';

function Blends() {
  return (
    <SearchableLayout searchSessionKey="blends-search">
      {({ searchString }) => <BlendsFeed searchString={searchString} />}
    </SearchableLayout>
  );
}

export default Blends;
