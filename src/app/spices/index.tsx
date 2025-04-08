import SpicesFeed from '../../components/SpicesFeed';
import SearchableLayout from '../../layouts/SearchableLayout';

function Spices() {
  return (
    <SearchableLayout searchSessionKey="spices-search">
      {({ searchString }) => <SpicesFeed searchString={searchString} />}
    </SearchableLayout>
  );
}

export default Spices;
