-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "emai" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "profilePicture" VARCHAR(255),
    "country" VARCHAR(255),
    "university" VARCHAR(255),
    "language" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_emai_key" ON "users"("emai");
