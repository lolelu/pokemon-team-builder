import { Pokemon } from "@prisma/client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PokemonSpriteIcon = (pokemon: Pokemon) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <img
            src={pokemon.spriteFront}
            alt={pokemon.name}
            className="h-10 w-10"
          />
        </TooltipTrigger>
        <TooltipContent className="capitalize">
          {pokemon.name} - #{pokemon.pokedexId}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PokemonSpriteIcon;
