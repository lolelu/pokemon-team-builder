"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import PokemonSpriteIcon from "@/components/pokemon-sprite-icon";
import { Button } from "@/components/ui/button";
import { Pokemon } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    cell: ({ row }) => {
      return (
        <div suppressHydrationWarning className="font-bold  ">
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "pokemons",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pokemon" />
    ),
    cell: ({ row }) => {
      return (
        <div className="grid w-32 grid-cols-3 place-items-center">
          {row.original.pokemons.map((pokemon) => (
            <PokemonSpriteIcon key={pokemon.id} {...pokemon} />
          ))}
        </div>
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
        <div suppressHydrationWarning className="text-center  font-bold ">
          {row.original.pokemons.reduce(
            (acc, curr) => acc + curr.baseExperience,
            0,
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "pokemonTypes",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pokemon Types" />
    ),
    cell: ({ row }) => {
      return (
        // Maximun 12 types for team, 3 rows of 4 types
        <div suppressHydrationWarning className="grid w-24 grid-cols-4 gap-1">
          {/* Map pokemon to types, flat it, remove dupes and then map the indicator */}
          {row.original.pokemons
            .map((pokemon) => pokemon.types)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((type) => (
              <Image
                key={type}
                alt={type}
                src={`/icons/${type}.svg`}
                width={24}
                height={24}
              />
            ))}
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
      return (
        <Button size="icon" variant={"ghost"} asChild>
          <Link href={`/team/${row.original.id}/edit`}>
            <Edit3 />
          </Link>
        </Button>
      );
    },
  },
];
