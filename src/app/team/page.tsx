import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { GetPokemonTeams } from "@/server/getters";
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TeamTable from "./team-table";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";

const TeamListing = async () => {
  const queryClient = new QueryClient();

  const basePaginationState: PaginationState = {
    pageIndex: 0,

    pageSize: 10,
  };

  const baseSortingState: SortingState = [
    {
      id: "createdAt",
      desc: true,
    },
  ];

  const baseTypeFilter: string[] = [];

  await queryClient.prefetchQuery({
    queryKey: ["teams", basePaginationState, baseSortingState, baseTypeFilter],
    queryFn: () =>
      GetPokemonTeams(basePaginationState, baseSortingState, baseTypeFilter),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4  sm:flex-row sm:items-center ">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">Team List</h2>
        </div>
      </div>

      {/*  have the table scroll horizzontally */}
      <div className="w-full ">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TeamTable
            basePaginationState={basePaginationState}
            baseSortingState={baseSortingState}
            baseTypeFilter={baseTypeFilter}
          />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default TeamListing;
