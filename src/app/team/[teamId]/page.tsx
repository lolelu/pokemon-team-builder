import React from "react";
type EditPageProps = {
  params: {
    teamId: string;
  };
};
const TeamPage = ({ params }: EditPageProps) => {
  return <div>Future team detail page for team {params.teamId}</div>;
};

export default TeamPage;
