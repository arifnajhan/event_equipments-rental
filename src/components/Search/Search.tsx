'use client'

import { useRouter } from "next/navigation";
import { ChangeEvent, FC } from "react"

type Props = {
    equipmentsTypeFilter: string;
    searchQuery: string;
    setEquipmentsTypeFilter: (value: string) => void;
    setSearchQuery: (value: string) => void;
  };

const Search: FC <Props> = ({
    equipmentsTypeFilter, 
    searchQuery,
    setEquipmentsTypeFilter,
    setSearchQuery,
 }) => {

    const router = useRouter()

    const handleEquipmentsTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setEquipmentsTypeFilter(event.target.value);
    };

    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const handleFilterClick = () => {
        router.push(`/equipments?equipmentType=${equipmentsTypeFilter}&searchQuery=${searchQuery}`);
    }
        
  return (
    <section className='bg-tertiary-light px-4 py-6 rounded-lg'>
      <div className='container mx-auto flex gap-4 flex-wrap justify-between items-center'>
        <div className='w-full md:1/3 lg:w-auto mb-4 md:mb-0'>
          <label className='block text-sm font-medium mb-2 text-black'>
            Equipments Type
          </label>
          <div className='relative'>
            <select
              value={equipmentsTypeFilter}
              onChange={handleEquipmentsTypeChange}
              className='w-full px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none'
            >
              <option value='All'>All</option>
              <option value='Furniture and Decor'>Furniture and Decor</option>
              <option value='Structures and Utility'>Structures and Utility</option>
              <option value='Carnival Games'>Carnival Games</option>
            </select>
          </div>
        </div>

        <div className='w-full md:1/3 lg:w-auto mb-4 md:mb-0'>
          <label className='block text-sm font-medium mb-2 text-black'>
            Search
          </label>
          <input
            type='search'
            id='search'
            placeholder='Search...'
            className='w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white'
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>

        <button
          className='px-6 md:px-[50px] lg:px-[72px] py-2 md:py-5 bg-green-600 rounded-lg md:rounded-2xl shadow-sm shadow-green-400 text-white font-bold text-base md:text-xl hover:scale-110 hover:bg-green-700'
          type='button'
          onClick={handleFilterClick}
        >
          Search
        </button>
      </div>
    </section>
  )
}

export default Search;
