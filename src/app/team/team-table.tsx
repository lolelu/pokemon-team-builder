"use client";
import { GetPokemonTeams } from "@/server/getters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import React, { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const TeamTable = ({
  basePaginationState,
  baseSortingState,
  baseTypeFilter,
}: {
  basePaginationState: PaginationState;
  baseSortingState: SortingState;
  baseTypeFilter: string[];
}) => {
  const [pagination, setPagination] =
    useState<PaginationState>(basePaginationState);

  const [sorting, setSorting] = useState<SortingState>(baseSortingState);
  const [typeFilter, setTypeFilter] = React.useState<string[]>(baseTypeFilter);

  const { data } = useQuery({
    queryKey: ["pokemon-teams", pagination, sorting, typeFilter],
    queryFn: () => GetPokemonTeams(pagination, sorting, typeFilter),
    placeholderData: keepPreviousData,
  });

  return (
    <DataTable
      columns={columns}
      data={data?.teams ?? []}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      rowCount={data?.count ?? 0}
    />
  );
};

export default TeamTable;
