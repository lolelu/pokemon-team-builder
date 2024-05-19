"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { pokemonTeamSchema, reducedPokemonTeamSchema } from "@/lib/schemas";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ActionResponse, CreateTeam } from "@/server/actions";

import { GetRandomPokemon } from "@/server/getters";
import { toast } from "sonner";

import PokemonTypeBadge from "@/components/pokemon-type-badge";
import { XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence, delay } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PokemonTeamForm = ({
  mutator,
  initialData,
  type,
}: {
  mutator: () => UseMutationResult<
    ActionResponse,
    Error,
    z.infer<typeof reducedPokemonTeamSchema>
  >;
  initialData?: z.infer<typeof pokemonTeamSchema>;
  type?: "create" | "edit";
}) => {
  //Used for invalidating the query cache

  const { mutate: server_mutateTeam, isPending: mutateTeam_isPending } =
    mutator();

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
      prepend(data);
      toast(`Added ${data.name} to your team!`);
    },
  });

  const handleAddPokemon = async () => {
    //We also validate server side
    if (fields.length >= 6) {
      toast("You can't have more than 6 Pokémon in your team");
      return;
    }
    const disabledPokemon = fields.map((f) => f.pokedexId);

    server_addRandomPokemonToTeam(disabledPokemon);
  };

  const form = useForm<z.infer<typeof pokemonTeamSchema>>({
    resolver: zodResolver(pokemonTeamSchema),
    defaultValues: initialData,
  });

  const { fields, append, prepend, remove } = useFieldArray({
    control: form.control,
    name: "pokemons",
    rules: {
      maxLength: 6,
    },
    keyName: "fieldId",
  });

  const onSubmit = async (data: z.infer<typeof pokemonTeamSchema>) => {
    const transformedData = {
      name: data.name,
      pokemons: data.pokemons.map((p) => p.pokedexId),
    };
    server_mutateTeam(transformedData);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-screen-lg  px-4 py-12 md:px-6">
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit, (error) =>
              console.error(error),
            )}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {type === "edit" ? "Edit" : "Create"} Your Pokémon Team
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
                Build your ultimate Pokémon team and get ready for the big
                battle.
              </p>
            </div>

            <div className="grid gap-8">
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
                <motion.button
                  type="button"
                  onClick={handleAddPokemon}
                  disabled={
                    fields.length >= 6 ||
                    mutateTeam_isPending ||
                    addRandomPokemonToTeam_isPending
                  }
                  className={cn(buttonVariants({}), "flex items-center gap-2")}
                  transition={{ layout: { duration: 0.3, type: "spring" } }}
                  layout
                >
                  <Image
                    className={cn({
                      "animate-spin": addRandomPokemonToTeam_isPending,
                    })}
                    src="/pokeball.png"
                    alt="Pokeball"
                    width={24}
                    height={24}
                  />
                  <AnimatePresence>
                    {/* When fields are 6, we hide the text with framer motion */}
                    {fields.length < 6 && (
                      <motion.span
                        key="add-pokemon"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        layout
                        transition={{
                          layout: { duration: 0.3, type: "spring", delay: 0.1 },
                        }}
                      >
                        Gotta Catch &apos;Em All!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <Button
                  type="submit"
                  disabled={
                    mutateTeam_isPending ||
                    fields.length < 1 ||
                    fields.length > 6 ||
                    addRandomPokemonToTeam_isPending
                  }
                >
                  {type === "edit" ? "Update Team" : "Create Team"}
                </Button>
              </div>
              <div className="grid grid-cols-1 grid-rows-1">
                <div className="col-start-1 row-start-1 mx-auto grid w-full   grid-cols-1 grid-rows-6 place-content-stretch  gap-8 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 ">
                  {/* add 6 placeholder */}
                  <AnimatePresence>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <motion.div
                        key={index}
                        className="h-96 w-full rounded-lg bg-gradient-to-br from-blue-500 via-purple-200 to-gray-500  shadow-inner"
                      ></motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <ul className="col-start-1 row-start-1 mx-auto grid w-full max-w-screen-lg grid-cols-1 grid-rows-6  place-content-stretch  gap-8 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 ">
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
  className,
  style,
}: {
  pokemon: z.infer<typeof pokemonTeamSchema>["pokemons"][0];
  remove: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <motion.li
      className={cn(
        "relative flex h-96 transform flex-col justify-between overflow-hidden  rounded-lg  border-2 border-slate-400 bg-white drop-shadow-lg " +
          className,
      )}
      style={style}
      initial={{ opacity: 0, scale: 0.5, rotateZ: -180 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        transition: { type: "spring" },
      }}
      exit={{ opacity: 0, scale: 0, rotateZ: 180 }}
      transition={{ layout: { duration: 0.3, type: "spring" } }}
      //On hover, the card will grow a little bit and rotate a little bit
      whileHover={{ scale: 1.05, rotate: 1 }}
      layout
      //Here to solve this issue: https://github.com/orgs/react-hook-form/discussions/11379
    >
      <Button
        className=" absolute right-0  top-0 flex h-8 w-8 items-center justify-center justify-self-end rounded-none rounded-bl-xl"
        size={"icon"}
        variant={"destructive"}
        onClick={remove}
        type="button"
      >
        <XIcon className="h-4 w-4" />
      </Button>
      <div className="grid grid-cols-3 place-items-center border-b-2 border-primary-foreground bg-gradient-to-r from-purple-400 via-violet-400   to-blue-500 p-2 text-primary-foreground">
        <div className="flex items-center justify-self-start">
          <span className="text-sm font-bold">#</span>
          <span className="  text-center text-sm font-bold">
            {pokemon.pokedexId}
          </span>
        </div>
        <span className=" truncate text-lg font-bold capitalize">
          {pokemon.name}
        </span>
        <div />
      </div>
      <div className="flex  h-full flex-col justify-between bg-blue-400 p-4 ">
        <div className="flex items-center justify-center rounded-md bg-white">
          <img
            alt={pokemon.name}
            className="h-40 w-auto xl:h-72"
            src={pokemon.spriteFront}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-md bg-secondary p-4 text-secondary-foreground">
          <div className="flex items-center justify-between text-xs">
            {pokemon.abilities.map((ability) => (
              <span key={ability} className="font-bold  capitalize ">
                {ability.replace(/-/g, " ")}
              </span>
            ))}
          </div>
          <Separator />
          <div className=" flex ">
            <div className="flex basis-full items-stretch justify-between">
              <span className="text-base">BASE EXP: </span>
              <span className="text-base font-bold">
                {pokemon.baseExperience}
              </span>
            </div>
          </div>
          <Separator />
          <div className=" flex items-center gap-2">
            {pokemon.types.map((type) => (
              <PokemonTypeBadge key={type} type={type} />
            ))}
            {pokemon.types.length < 1 && <PokemonTypeBadge type="unknown" />}
          </div>
        </div>
      </div>
    </motion.li>
  );
};
