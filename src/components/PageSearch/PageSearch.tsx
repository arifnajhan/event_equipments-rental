'use client';

import { useState } from 'react';

import Search from '../Search/Search';

const PageSearch = () => {
  const [equipmentsTypeFilter, setEquipmentsTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Search
      equipmentsTypeFilter={equipmentsTypeFilter}
      searchQuery={searchQuery}
      setEquipmentsTypeFilter={setEquipmentsTypeFilter}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default PageSearch;