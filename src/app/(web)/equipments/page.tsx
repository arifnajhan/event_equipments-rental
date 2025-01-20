'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import useSWR from "swr";
import { getEquipments } from "@/libs/apis";
import { Equipment } from "@/models/equipments";
import Search from "@/components/Search/Search";
import EquipmentsCard from "@/components/EquipmentsCard/EquipmentsCard";

const EventEquipments = () => {
    const [equipmentsTypeFilter, setEquipmentsTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get('searchQuery');
        const equipmentType = searchParams.get('equipmentType');

    if (equipmentType) setEquipmentsTypeFilter(equipmentType);
    if (searchQuery) setSearchQuery(searchQuery);

    }, []);

    async function fetchData(){
        return getEquipments();
    }

    const {data, error, isLoading} = useSWR('get/eventEquipment', fetchData);
    
    if(error) throw new Error ("Cannot fetch data")
    if (typeof data === 'undefined' && !isLoading)
        throw new Error('Cannot fetch data');

    const filterEquipments = (equipments: Equipment[]) =>{
        return equipments.filter(equipment =>{

            if(
                equipmentsTypeFilter && 
                equipmentsTypeFilter.toLocaleLowerCase() !=="all" && 
                equipment.type.toLowerCase() !== equipmentsTypeFilter.toLowerCase()
            ) {
                return false;
            }

            if (
                searchQuery && 
                !equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
            ){
                return false;
            }
            return true;
        });
    };

    const filteredEquipments = filterEquipments(data || []);

    return <div className="container mx-auto pt-10">
        <Search
            equipmentsTypeFilter={equipmentsTypeFilter}
            searchQuery={searchQuery}
            setEquipmentsTypeFilter={setEquipmentsTypeFilter}
            setSearchQuery={setSearchQuery}
        />

        <div className='flex mt-20 justify-between flex-wrap'>
        {filteredEquipments.map(equipment => (
          <EquipmentsCard key={equipment._id} equipment={equipment} />
        ))}
        </div>
    </div>;
};

export default EventEquipments
