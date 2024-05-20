"use server";

import { reducedPokemonTeamSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ActionResponse = {
  errors?: Record<string, string[]>;
  message?: string;
};

const CreateTeam = async (
  data: z.infer<typeof reducedPokemonTeamSchema>,
): Promise<ActionResponse> => {
  //create a team with prisma, after validation with zod

  const validatedFields = reducedPokemonTeamSchema.safeParse({
    name: data.name,
    pokemons: data.pokemons,
  });

  if (!validatedFields.success) {
    throw new Error("Invalid data");
  }

  const { name, pokemons: pokemon } = validatedFields.data;

  await checkPokemonExistence(pokemon);

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

  revalidatePath("/team");

  redirect("/team");
};

const UpdateTeam = async (
  id: string,
  data: z.infer<typeof reducedPokemonTeamSchema>,
): Promise<ActionResponse> => {
  //update a team with prisma, after validation with zod

  const validatedFields = reducedPokemonTeamSchema.safeParse({
    name: data.name,
    pokemons: data.pokemons,
  });

  if (!validatedFields.success) {
    throw new Error("Invalid data");
  }

  const { name, pokemons: pokemon } = validatedFields.data;

  // Check if all pokemon IDs exist in the database
  await checkPokemonExistence(pokemon);

  // Update team with prisma
  await db.pokemonTeam.update({
    where: {
      id: id,
    },
    data: {
      name,
      pokemons: {
        set: pokemon.map((pokedexId) => ({
          pokedexId: pokedexId,
        })),
      },
    },
  });

  revalidatePath("/team");

  redirect("/team");
};

async function checkPokemonExistence(pokemon: number[]) {
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

  // Check for missing IDs
  const existingPokemonIds = new Set(existingPokemons.map((p) => p.pokedexId));
  const missingIds = pokemon.filter((id) => !existingPokemonIds.has(id));

  if (missingIds.length > 0) {
    throw new Error(
      `The following Pokémon IDs do not exist: ${missingIds.join(", ")}`,
    );
  }
}
export { CreateTeam, UpdateTeam };
