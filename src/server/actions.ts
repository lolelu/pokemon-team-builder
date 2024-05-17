"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { reducedPokemonTeamSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";

type ActionResponse = {
  errors?: Record<string, string[]>;
  message?: string;
};

const CreateTeam = async (
  data: z.infer<typeof reducedPokemonTeamSchema>,
): Promise<ActionResponse> => {
  //create a team with prisma, after validation with zod

  const validatedFields = reducedPokemonTeamSchema.safeParse({
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
      pokedexId: {
        in: pokemon,
      },
    },
    select: {
      pokedexId: true,
    },
  });

  //Add a little delay for debug purposes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check for missing IDs
  const existingPokemonIds = new Set(existingPokemons.map((p) => p.pokedexId));
  const missingIds = pokemon.filter((id) => !existingPokemonIds.has(id));

  if (missingIds.length > 0) {
    throw new Error(
      `The following Pokémon IDs do not exist: ${missingIds.join(", ")}`,
    );
  }

  // Create team with prisma
  await db.pokemonTeam.create({
    data: {
      name,
      pokemons: {
        connect: pokemon.map((pokedexId) => ({
          pokedexId: pokedexId,
        })),
      },
    },
  });

  redirect("/team");
};

export { CreateTeam };
