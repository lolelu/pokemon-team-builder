export type PokeapiType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type PokeapiAbility = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
};
