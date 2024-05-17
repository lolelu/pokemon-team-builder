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
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateTeam } from "@/server/actions";
import { error } from "console";
import { GetRandomPokemon } from "@/server/getters";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const CreatePage = () => {
  const createTeamMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reducedPokemonTeamSchema>) =>
      await CreateTeam(data),

    onSuccess: () => {
      toast("Team created successfully");
    },
    onError: (error) => {
      console.error("Error creating team:", error);
      toast("Error creating team");
    },
  });

  const getRandomPokemonMutation = useMutation({
    mutationFn: () => {
      return GetRandomPokemon();
    },
    onError: (error) => {
      console.error("Error getting random pokemon:", error);
      toast("Error getting random pokemon");
    },
    onSuccess: (data) => {
      const pokemonData = {
        name: data.name,
        pokedexId: data.pokedexId,
        spriteFront: data.spriteFront,
        spriteBack: data.spriteBack,
        spriteShinyFront: data.spriteShinyFront,
        spriteShinyBack: data.spriteShinyBack,
      };
      append(pokemonData);

      toast(`Added ${data.name} to your team!`);
    },
  });

  const handleAddPokemon = async () => {
    if (fields.length >= 6) {
      toast("You can't have more than 6 Pokémon in your team");
      return;
    }

    getRandomPokemonMutation.mutate();
  };

  const form = useForm<z.infer<typeof pokemonTeamSchema>>({
    resolver: zodResolver(pokemonTeamSchema),
    defaultValues: {
      name: "Ash Ketchum Team",
      pokemon: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "pokemon",
  });

  const onSubmit = async (data: z.infer<typeof pokemonTeamSchema>) => {
    const transformedData = {
      name: data.name,
      pokemon: data.pokemon.map((p) => p.pokedexId),
    };
    createTeamMutation.mutate(transformedData);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl  px-4 py-12 md:px-6">
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
                    createTeamMutation.isPending ||
                    getRandomPokemonMutation.isPending
                  }
                >
                  Gotta Catch 'Em All!
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTeamMutation.isPending ||
                    fields.length < 1 ||
                    fields.length > 6 ||
                    getRandomPokemonMutation.isPending
                  }
                >
                  Create Team
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {fields.map((pokemon) => (
                  <li
                    className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950"
                    key={pokemon.id}
                  >
                    <div className="aspect-square">
                      <img
                        alt={pokemon.name}
                        className="h-full w-full object-cover"
                        height={300}
                        src={pokemon.spriteFront}
                        style={{
                          aspectRatio: "300/300",
                          objectFit: "cover",
                        }}
                        width={300}
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg font-medium">{pokemon.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary-500/10 text-primary-500 rounded-md px-2 py-1 text-xs font-medium">
                          Electric
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </Form>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Pokémon 1"
                className="h-full w-full object-cover"
                height={300}
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width={300}
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Pikachu</h3>
              <div className="flex items-center gap-2">
                <span className="bg-primary-500/10 text-primary-500 rounded-md px-2 py-1 text-xs font-medium">
                  Electric
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Placeholder"
                className="h-full w-full object-cover"
                height="300"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width="300"
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Placeholder</h3>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Pokémon 3"
                className="h-full w-full object-cover"
                height={300}
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width={300}
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Blastoise</h3>
              <div className="flex items-center gap-2">
                <span className="bg-primary-500/10 text-primary-500 rounded-md px-2 py-1 text-xs font-medium">
                  Water
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Placeholder"
                className="h-full w-full object-cover"
                height="300"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width="300"
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Placeholder</h3>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Pokémon 5"
                className="h-full w-full object-cover"
                height={300}
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width={300}
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Mewtwo</h3>
              <div className="flex items-center gap-2">
                <span className="bg-primary-500/10 text-primary-500 rounded-md px-2 py-1 text-xs font-medium">
                  Psychic
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-950">
            <div className="aspect-square">
              <img
                alt="Placeholder"
                className="h-full w-full object-cover"
                height="300"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "300/300",
                  objectFit: "cover",
                }}
                width="300"
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-medium">Placeholder</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
