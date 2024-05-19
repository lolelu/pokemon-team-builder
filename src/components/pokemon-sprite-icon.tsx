import { Pokemon } from "@prisma/client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

const PokemonSpriteIcon = (pokemon: Pokemon) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            src={pokemon.spriteFront}
            alt={pokemon.name}
            className="aspect-square h-auto min-w-10"
            width={56}
            height={56}
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
