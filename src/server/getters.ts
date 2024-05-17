"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { pokemonTeamSchema } from "@/lib/schemas";
import { Pokemon } from "@prisma/client";
import { PokeapiType } from "@/types/pokeapi.types";

const GetPokemon = async (pokedexId: number) => {
  try {
    console.log("Fetching pokemon with ID: " + pokedexId);
    //1. Check if the pokemon exists in the database and it has not been updated in the last week
    let pokemon: Pokemon | null = await db.pokemon.findFirst({
      where: {
        pokedexId: pokedexId,
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    //2. If the pokemon does not exist or is older than 1 week, fetch it from the pokeapi and save it to the database. if the pokemon does not exist in the api, return an error

    if (!pokemon) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokedexId}`,
      );
      if (!response.ok) {
        throw new Error("Pokemon not found in the API with ID " + pokedexId);
      }

      const data = await response.json();

      //Parse types

      const types = data.types.map((type: PokeapiType) => type.type.name);

      //TODO: link types and abilities to the pokemon
      pokemon = await db.pokemon.upsert({
        where: {
          pokedexId: pokedexId,
        },

        // Some fields might be null on pokeapi, so we need to check for that
        create: {
          pokedexId: data.id,
          name: data.name,
          baseExperience: data.base_experience,
          spriteFront: data.sprites.front_default || data.sprites.front_female,
          spriteBack: data.sprites.back_default || data.sprites.back_female,
          spriteShinyFront:
            data.sprites.front_shiny || data.sprites.front_shiny_female,
          spriteShinyBack:
            data.sprites.back_shiny || data.sprites.back_shiny_female,
          types: types,
        },
        update: {
          name: data.name,
          baseExperience: data.base_experience,
          spriteFront: data.sprites.front_default,
          spriteBack: data.sprites.back_default,
          spriteShinyFront: data.sprites.front_shiny,
          spriteShinyBack: data.sprites.back_shiny,
        },
      });
    }

    return pokemon;
  } catch (e) {
    console.error(e);
    throw new Error("Error in pokemon retrieval");
  }
};

const GetRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 898) + 1;
  return GetPokemon(randomId);
};

export { GetPokemon, GetRandomPokemon };
