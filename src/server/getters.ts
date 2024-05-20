"use server";
import { db } from "@/server/db";
import { PokeapiType } from "@/types/pokeapi.types";
import { Pokemon } from "@prisma/client";
import { PaginationState, SortingState } from "@tanstack/react-table";

type PokemonAbility = {
  isHidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
};

const GetPokemon = async (pokedexId: number) => {
  try {
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

      const abilities = data.abilities.map(
        (ability: PokemonAbility) => ability.ability.name,
      );

      //TODO: link types and abilities to the pokemon
      pokemon = await db.pokemon.upsert({
        where: {
          pokedexId: pokedexId,
        },

        // Some fields might be null on pokeapi, so we need to check for that
        create: {
          pokedexId: data.id,
          name: data.species.name,
          baseExperience: data.base_experience,
          spriteFront: data.sprites.front_default || data.sprites.front_female,
          spriteBack: data.sprites.back_default || data.sprites.back_female,
          spriteShinyFront:
            data.sprites.front_shiny || data.sprites.front_shiny_female,
          spriteShinyBack:
            data.sprites.back_shiny || data.sprites.back_shiny_female,
          types: types,
          abilities: abilities,
        },
        update: {
          name: data.name,
          baseExperience: data.base_experience,
          spriteFront: data.sprites.front_default,
          spriteBack: data.sprites.back_default,
          spriteShinyFront: data.sprites.front_shiny,
          spriteShinyBack: data.sprites.back_shiny,
          types: types,
          abilities: abilities,
        },
      });
    }

    return pokemon;
  } catch (e) {
    console.error(e);
    throw new Error("Error in pokemon retrieval");
  }
};

const GetRandomPokemon = async (disabledIds: number[] = []) => {
  // Hardcode the maximum number of pokemon to 1025, because pokeapi othwerwise will also suggest alternate forms and mega evolutions
  let randomId: number;
  do {
    randomId = Math.floor(Math.random() * 1025) + 1;
  } while (disabledIds.includes(randomId));

  return GetPokemon(randomId);
};

const GetPokemonTeams = async (
  paginationState: PaginationState,
  sorting: SortingState,
  baseTypeFilter: string[],
) => {
  try {
    //First, count the total number of teams
    const totalTeams = await db.pokemonTeam.count();

    //Then, fetch the teams with pagination ( if there are any  )

    if (totalTeams === 0) {
      return {
        teams: [],
        count: 0,
      };
    }

    let sortQuery = {};
    if (sorting.length > 0) {
      sortQuery = {
        orderBy: sorting.map((sort) => ({
          [sort.id]: sort.desc ? "desc" : "asc",
        })),
      };
    }

    let typeFilter = {};
    if (baseTypeFilter.length > 0) {
      typeFilter = {
        where: {
          pokemons: {
            some: {
              types: {
                hasSome: baseTypeFilter,
              },
            },
          },
        },
      };
    }

    const teams = await db.pokemonTeam.findMany({
      take: paginationState.pageSize,
      skip: paginationState.pageIndex * paginationState.pageSize,
      ...sortQuery,
      ...typeFilter,
      include: {
        pokemons: true,
      },
    });

    return {
      teams,
      count: totalTeams,
    };
  } catch (e) {
    console.error(e);
    throw new Error("Error in teams retrieval");
  }
};

const GetPokemonTeam = async (id: string) => {
  try {
    const team = await db.pokemonTeam.findUnique({
      where: {
        id: id,
      },
      include: {
        pokemons: true,
      },
    });

    return team;
  } catch (e) {
    console.error(e);
    throw new Error("Error in team retrieval");
  }
};

export { GetPokemon, GetPokemonTeam, GetPokemonTeams, GetRandomPokemon };
