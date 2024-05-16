"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { pokemonTeamSchema } from "@/lib/schemas";
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
import { useMutation } from "@tanstack/react-query";
import { CreateTeam, GetRandomPokemon } from "@/app/actions";
import { error } from "console";

const CreatePage = () => {
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof pokemonTeamSchema>) => {
      return CreateTeam(data);
    },
    onError: (error) => {
      console.error("Error creating team:", error);
    },
  });

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
    mutation.mutate(data);
  };

  const handleAddPokemon = async () => {
    const pokemon = await GetRandomPokemon();
    if (pokemon) {
      append(pokemon);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit, (error) => console.error(error))}
      >
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

        {/* List selected Pokémon */}
        {fields.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Selected Pokémon</h3>
            <ul>
              {fields.map((pokemon, index) => (
                <li key={pokemon.id}>
                  {pokemon.name} (#{pokemon.id})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Button to add a random Pokémon */}
        <Button type="button" onClick={handleAddPokemon}>
          Gotta Catch 'Em All!
        </Button>

        <Button type="submit" disabled={mutation.isPending}>
          Create Team
        </Button>

        {/* Display errors */}
        {mutation.error && (
          <p className="text-red-500">
            Error: {(mutation.error as Error).message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default CreatePage;
