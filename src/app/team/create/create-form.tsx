"use client";
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
import { XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

const PokemonTeamForm = () => {
  //Used for invalidating the query cache
  const queryClient = useQueryClient();

  const {
    mutate: server_createTeam,
    isPending: createTeam_isPending,
    isError: createTeam_isError,
  } = useMutation({
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

  const {
    mutate: server_addRandomPokemonToTeam,
    isPending: addRandomPokemonToTeam_isPending,
    isError: addRandomPokemonToTeam_isError,
  } = useMutation({
    mutationFn: GetRandomPokemon,
    onError: (error) => {
      console.error("Error getting random pokemon:", error);
      toast("Error getting random pokemon");
    },
    onSuccess: (data) => {
      append(data);
      toast(`Added ${data.name} to your team!`);
    },
  });

  const handleAddPokemon = async () => {
    //We also validate server side
    if (fields.length >= 6) {
      toast("You can't have more than 6 Pokémon in your team");
      return;
    }

    server_addRandomPokemonToTeam();
  };

  const form = useForm<z.infer<typeof pokemonTeamSchema>>({
    resolver: zodResolver(pokemonTeamSchema),
    defaultValues: {
      name: "Ash Ketchum Team",
      pokemon: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pokemon",
    rules: {
      maxLength: 6,
    },
    keyName: "fieldId",
  });

  const onSubmit = async (data: z.infer<typeof pokemonTeamSchema>) => {
    const transformedData = {
      name: data.name,
      pokemon: data.pokemon.map((p) => p.pokedexId),
    };
    server_createTeam(transformedData);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl  px-4 py-12 md:px-6">
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit, (error) =>
              console.error(error),
            )}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Create Your Pokémon Team
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
                Build your ultimate Pokémon team and get ready for the big
                battle.
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ash Ketchum Team" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of your Pokémon team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={handleAddPokemon}
                  disabled={
                    fields.length >= 6 ||
                    createTeam_isPending ||
                    addRandomPokemonToTeam_isPending
                  }
                >
                  Gotta Catch 'Em All!
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTeam_isPending ||
                    fields.length < 1 ||
                    fields.length > 6 ||
                    addRandomPokemonToTeam_isPending
                  }
                >
                  Create Team
                </Button>
              </div>

              <ul className="mx-auto grid w-full max-w-screen-lg grid-cols-1 place-content-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <PokemonCard
                      key={field.fieldId}
                      pokemon={field}
                      remove={() => remove(index)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PokemonTeamForm;

const PokemonCard = ({
  pokemon,
  remove,
}: {
  pokemon: z.infer<typeof pokemonTeamSchema>["pokemon"][0];
  remove: () => void;
}) => {
  return (
    <motion.li
      className=" overflow-hidden rounded-lg bg-white shadow-lg "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      //Here to solve this issue: https://github.com/orgs/react-hook-form/discussions/11379

      key={pokemon.pokedexId}
    >
      <div className="grid grid-cols-3 place-items-center bg-primary p-2 text-primary-foreground">
        <div className="flex items-center justify-self-start">
          <span className="text-sm font-bold">#</span>
          <span className="  text-center text-sm font-bold">
            {pokemon.pokedexId}
          </span>
        </div>
        <span className=" truncate text-lg font-bold capitalize">
          {pokemon.name}
        </span>
        <Button
          className=" flex h-6 w-6 items-center justify-center justify-self-end rounded-full"
          size={"icon"}
          variant={"destructive"}
          onClick={remove}
          type="button"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center">
        <img
          alt={pokemon.name}
          className="h-40 w-auto xl:h-72"
          src={pokemon.spriteFront}
        />
      </div>
      <div className="bg-secondary p-4 text-secondary-foreground">
        <div className="flex items-center justify-between text-xs">
          {pokemon.abilities.map((ability) => (
            <span key={ability} className="capitalize">
              {ability}
            </span>
          ))}
        </div>
        <div className="mt-2 flex ">
          <div className="flex basis-full items-stretch justify-between">
            <span className="text-base">BASE EXP: </span>
            <span className="text-base font-bold">
              {pokemon.baseExperience}
            </span>
          </div>
        </div>
        <Separator />
        <div className="mt-2 flex items-center gap-2">
          {pokemon.types.map((type) => (
            <PokemonTypeBadge key={type} type={type} />
          ))}
          {pokemon.types.length < 1 && <PokemonTypeBadge type="unknown" />}
        </div>
      </div>
    </motion.li>
  );
};
