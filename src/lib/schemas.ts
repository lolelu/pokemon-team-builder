import { z } from "zod";

const pokemonSchema = z.object({
  name: z.string().min(3).max(255),
  pokedexId: z.number(),
  spriteFront: z.string().url(),
  spriteBack: z.string().url().nullable(),
  spriteShinyFront: z.string().url().nullable(),
  spriteShinyBack: z.string().url().nullable(),
  types: z.array(z.string()).max(2),
  baseExperience: z.number(),
  abilities: z.array(z.string()),
});

const pokemonTeamSchema = z.object({
  name: z.string().min(3).max(255),
  pokemon: z.array(pokemonSchema).max(6),
});

const reducedPokemonTeamSchema = z.object({
  name: z.string().min(3).max(255),
  pokemon: z.array(z.number()).max(6),
});

export { pokemonTeamSchema, reducedPokemonTeamSchema, pokemonSchema };
