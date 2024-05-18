"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import PokemonSpriteIcon from "@/components/pokemon-sprite-icon";
import { Button } from "@/components/ui/button";
import { Pokemon } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

//Redefined the PokemonTeam type to include the Pokemon type (not included in Prisma generated types)
export type PokemonTeam = {
  id: string;
  name: string;
  pokemons: Pokemon[];
  createdAt: Date;
  updatedAt: Date;
};
export const columns: ColumnDef<PokemonTeam>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "pokemons",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pokemon" />
    ),
    cell: ({ row }) => {
      return (
        <>
          {row.original.pokemons.map((pokemon) => (
            <PokemonSpriteIcon key={pokemon.id} {...pokemon} />
          ))}
        </>
      );
    },
  },
  {
    accessorKey: "baseExpSum",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Base Exp. Sum
      "
      />
    ),
    cell: ({ row }) => {
      return (
        <div suppressHydrationWarning>
          {row.original.pokemons.reduce(
            (acc, curr) => acc + curr.baseExperience,
            0,
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div suppressHydrationWarning>
          {row.original.createdAt.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      return (
        <div suppressHydrationWarning>
          {row.original.createdAt.toLocaleDateString()}
        </div>
      );
    },
  },
  //Edit and Delete buttons
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          size="icon"
          variant={"ghost"}
          onClick={() => {
            // Navigate to the edit page
            router.push(`/team/${row.original.id}/edit`);
          }}
        >
          <Edit3 />
        </Button>
      );
    },
  },
];
