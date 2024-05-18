import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { pokemonTeamSchema, reducedPokemonTeamSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTeam } from "@/server/actions";

import { GetRandomPokemon } from "@/server/getters";
import { toast } from "sonner";

import PokemonTypeBadge from "@/components/pokemon-type-badge";
import PokemonTeamForm from "./create-form";

const CreatePage = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl  px-4 py-12 md:px-6">
        <PokemonTeamForm />
      </div>
    </>
  );
};

export default CreatePage;
