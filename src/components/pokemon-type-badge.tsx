import React from "react";
import pokemonTypes from "@/consts/ pokemon-types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const PokemonTypeBadge = ({ type }: { type: string }) => {
  //Check if the type exists in the pokemonTypes object, otherwise set it to unknown
  const typeData =
    pokemonTypes.find((t) => t.type === type) ||
    pokemonTypes.find((t) => t.type === "unknown");

  return (
    <div
      className={cn(
        typeData?.color,
        "flex w-16 justify-center rounded-md py-1 text-sm font-bold  text-white drop-shadow-md",
      )}
    >
      {typeData?.type}
    </div>
  );
};

export default PokemonTypeBadge;
