import React from "react";

type EditPageProps = {
  params: {
    teamId: string;
  };
};
const EditPage = ({ params }: EditPageProps) => {
  return <div>Edit page for team {params.teamId}</div>;
};

export default EditPage;
