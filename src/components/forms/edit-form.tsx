"use client";
import React from "react";
import PokemonTeamForm from "./pokemon-team-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateTeam, UpdateTeam } from "@/server/actions";

import { pokemonTeamSchema, reducedPokemonTeamSchema } from "@/lib/schemas";
import { z } from "zod";

const EditPokemonForm = ({
  id,
  pokemonTeam,
}: {
  id: string;
  pokemonTeam: z.infer<typeof pokemonTeamSchema>;
}) => {
  const queryClient = useQueryClient();

  const mutator = () =>
    useMutation({
      mutationFn: (data: z.infer<typeof reducedPokemonTeamSchema>) =>
        UpdateTeam(id, data),

      onSuccess: () => {
        toast("Team edited successfully");
        queryClient.invalidateQueries({ queryKey: ["pokemon-teams"] });
      },
      onError: (error) => {
        console.error("Error editing team:", error);
        toast("Error editing team");
      },
    });
  return (
    <>
      <PokemonTeamForm
        mutator={mutator}
        initialData={pokemonTeam}
        type="edit"
      />
    </>
  );
};

export default EditPokemonForm;
