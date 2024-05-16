"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { pokemonTeamSchema } from "@/lib/schemas";
import { Pokemon } from "@prisma/client";

type ActionResponse = {
  errors?: Record<string, string[]>;
  message?: string;
};

const CreateTeam = async (
  data: z.infer<typeof pokemonTeamSchema>,
): Promise<ActionResponse> => {
  //create a team with prisma, after validation with zod

  const validatedFields = pokemonTeamSchema.safeParse({
    name: data.name,
    pokemon: data.pokemon,
  });

  if (!validatedFields.success) {
    throw new Error("Invalid data");
  }

  const { name, pokemon } = validatedFields.data;

  // Check if all pokemon IDs exist in the database
  const existingPokemons = await db.pokemon.findMany({
    where: {
      id: {
        in: pokemon,
      },
    },
    select: {
      id: true,
    },
  });

  //Add a little delay for debug purposes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check for missing IDs
  const existingPokemonIds = new Set(existingPokemons.map((p) => p.id));
  const missingIds = pokemon.filter((id) => !existingPokemonIds.has(id));

  if (missingIds.length > 0) {
    // return {
    //   errors: {
    //     pokemon: [
    //       `The following Pokémon IDs do not exist: ${missingIds.join(", ")}`,
    //     ],
    //   },
    // };

    throw new Error(
      `The following Pokémon IDs do not exist: ${missingIds.join(", ")}`,
    );
  }

  // Create team with prisma
  await db.pokemonTeam.create({
    data: {
      name,
      pokemons: {
        connect: pokemon.map((id) => ({ id })),
      },
    },
  });

  return {
    message: "Team created successfully",
  };
};

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

      //TODO: link types and abilities to the pokemon
      pokemon = await db.pokemon.upsert({
        where: {
          pokedexId: pokedexId,
        },
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

export { CreateTeam, GetPokemon, GetRandomPokemon };
