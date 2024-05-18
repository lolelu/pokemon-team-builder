"use client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetPokemonTeams } from "@/server/getters";

const TeamTable = ({
  basePaginationState,
  baseSortingState,
}: {
  basePaginationState: PaginationState;
  baseSortingState: SortingState;
}) => {
  const [pagination, setPagination] =
    useState<PaginationState>(basePaginationState);

  const [sorting, setSorting] = useState<SortingState>(baseSortingState);

  const { data } = useQuery({
    queryKey: ["teams", pagination, sorting],
    queryFn: () => GetPokemonTeams(pagination, sorting),
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
      rowCount={data?.count ?? 0}
    />
  );
};

export default TeamTable;
