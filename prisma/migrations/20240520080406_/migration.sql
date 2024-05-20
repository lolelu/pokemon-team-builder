-- CreateTable
CREATE TABLE "PokemonTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" TEXT NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "baseExperience" INTEGER NOT NULL,
    "spriteFront" TEXT NOT NULL,
    "spriteBack" TEXT,
    "spriteShinyFront" TEXT,
    "spriteShinyBack" TEXT,
    "abilities" TEXT[],
    "types" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pokemonTeamId" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexId_key" ON "Pokemon"("pokedexId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonTeamId_fkey" FOREIGN KEY ("pokemonTeamId") REFERENCES "PokemonTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
