import EditPokemonForm from "@/components/forms/edit-form";
import { GetPokemonTeam } from "@/server/getters";
import { notFound } from "next/navigation";

type EditPageProps = {
  params: {
    teamId: string;
  };
};
const EditPage = async ({ params }: EditPageProps) => {
 
  const pokemonTeam = await GetPokemonTeam(params.teamId);

  if (!pokemonTeam) {
    notFound();
  }

  return <EditPokemonForm id={params.teamId} pokemonTeam={pokemonTeam} />;
};

export default EditPage;
