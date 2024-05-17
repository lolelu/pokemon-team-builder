import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { GetPokemonTeams } from "@/server/getters";

const TeamListing = async () => {
  const teams = await GetPokemonTeams(1, 10);
  return <DataTable columns={columns} data={teams} />;
};

export default TeamListing;
