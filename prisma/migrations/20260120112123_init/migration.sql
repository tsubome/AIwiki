-- CreateTable
CREATE TABLE "LLMModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parameters" TEXT,
    "releaseDate" DATETIME,
    "developer" TEXT,
    "license" TEXT,
    "huggingface" TEXT,
    "parentId" TEXT,
    "modelType" TEXT NOT NULL DEFAULT 'BASE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LLMModel_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LLMModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GGUFFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "url" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "GGUFFile_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "LLMModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LLMModel_slug_key" ON "LLMModel"("slug");
