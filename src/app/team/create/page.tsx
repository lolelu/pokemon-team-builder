import React from "react";

import CreatePokemonForm from "@/components/forms/create-form";

const CreatePage = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl  px-4 py-12 md:px-6">
        <CreatePokemonForm />
      </div>
    </>
  );
};

export default CreatePage;
