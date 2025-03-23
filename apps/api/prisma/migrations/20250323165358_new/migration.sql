-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "tree" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
