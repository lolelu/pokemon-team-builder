"use client";
import React from "react";
import PokemonTeamForm from "./pokemon-team-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateTeam } from "@/server/actions";

const CreatePokemonForm = () => {
  const queryClient = useQueryClient();

  const useMutator = () =>
    useMutation({
      mutationFn: CreateTeam,
      onSuccess: () => {
        toast("Team created successfully");
        queryClient.invalidateQueries({ queryKey: ["pokemon-teams"] });
      },
      onError: (error) => {
        console.error("Error creating team:", error);
        toast("Error creating team");
      },
    });
  return (
    <>
      <PokemonTeamForm mutator={useMutator} type="create" />
    </>
  );
};

export default CreatePokemonForm;
