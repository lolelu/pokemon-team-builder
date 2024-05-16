import { z } from "zod";

const pokemonTeamSchema = z.object({
  name: z.string().min(3).max(255),
  pokemon: z.array(z.string()).max(6),
});

export { pokemonTeamSchema };
