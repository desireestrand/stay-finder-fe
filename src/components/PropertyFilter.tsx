"use client"

import { Dispatch, SetStateAction, useState } from "react";
import T from "./typography";
import { useRouter } from "next/navigation";
import { PropertiesFilter } from "@/app/utils/propertyService";

type SearchBarProps = {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>
}

function Searchbar({
    search,
    setSearch
}: SearchBarProps) {
    return (
        <input 
          type="search" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md dark:bg-zinc-800"
          placeholder="Search city..."
        />
    )
}

type PropertyFilterProps = {
    filter: PropertiesFilter
}

export default function PropertyFilter({ filter }: PropertyFilterProps) {
    const router = useRouter()
    const [search, setSearch] = useState(filter.city || "");

    const onFiltering = () => {
      router.push(`/?city=${search}`)
    }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <T.Header size="sm">[PROPERTIES FILTER]</T.Header>
      <div className="flex gap-2">
        <Searchbar search={search} setSearch={setSearch}/>
        <button 
          type="button" 
          onClick={onFiltering}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          Filter
        </button>
      </div>
    </div>
  );
}