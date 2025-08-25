-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100),
    "password" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
