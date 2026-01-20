import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.gGUFFile.deleteMany()
  await prisma.lLMModel.deleteMany()

  // Create Llama 2 (root)
  const llama2 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2',
      slug: 'llama-2-70b',
      description: 'Llama 2 is a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. This is the 70B pretrained model.',
      parameters: '70B',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-2-70b',
      modelType: 'BASE',
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '40.0GB', url: 'https://huggingface.co/TheBloke/Llama-2-70B-GGUF/resolve/main/llama-2-70b.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '48.5GB', url: 'https://huggingface.co/TheBloke/Llama-2-70B-GGUF/resolve/main/llama-2-70b.Q5_K_M.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Llama 3 70B (child of Llama 2)
  const llama3_70b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3',
      slug: 'llama-3-70b',
      description: 'Llama 3 is the latest iteration of the Llama family of models. The 70B parameter model offers state-of-the-art performance across various benchmarks.',
      parameters: '70B',
      releaseDate: new Date('2024-04-18'),
      developer: 'Meta',
      license: 'Llama 3 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3-70B',
      modelType: 'BASE',
      parentId: llama2.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '42.5GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-70B-GGUF/resolve/main/Meta-Llama-3-70B.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '51.2GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-70B-GGUF/resolve/main/Meta-Llama-3-70B.Q5_K_M.gguf', recommended: false },
          { name: 'Q8_0', size: '74.5GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-70B-GGUF/resolve/main/Meta-Llama-3-70B.Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Llama 3 8B (child of Llama 3 70B family)
  const llama3_8b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 8B',
      slug: 'llama-3-8b',
      description: 'The smaller 8B parameter version of Llama 3. Excellent for resource-constrained environments while maintaining strong performance.',
      parameters: '8B',
      releaseDate: new Date('2024-04-18'),
      developer: 'Meta',
      license: 'Llama 3 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B',
      modelType: 'BASE',
      parentId: llama3_70b.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.9GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '5.7GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q5_K_M.gguf', recommended: false },
          { name: 'Q8_0', size: '8.5GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Llama 3 Japanese 8B (finetune of Llama 3 8B)
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 Japanese 8B',
      slug: 'llama-3-japanese-8b',
      description: 'Japanese language fine-tuned version of Llama 3 8B. Optimized for Japanese text generation and understanding.',
      parameters: '8B',
      releaseDate: new Date('2024-05-15'),
      developer: 'ELYZA',
      license: 'Llama 3 Community License',
      huggingface: 'https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B',
      modelType: 'FINETUNE',
      parentId: llama3_8b.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.9GB', url: 'https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF/resolve/main/Llama-3-ELYZA-JP-8B-Q4_K_M.gguf', recommended: true },
          { name: 'Q8_0', size: '8.5GB', url: 'https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF/resolve/main/Llama-3-ELYZA-JP-8B-Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Mistral 7B (root)
  const mistral7b = await prisma.lLMModel.create({
    data: {
      name: 'Mistral 7B',
      slug: 'mistral-7b',
      description: 'Mistral 7B is a 7.3B parameter model that outperforms Llama 2 13B on all benchmarks and Llama 1 34B on many benchmarks.',
      parameters: '7B',
      releaseDate: new Date('2023-09-27'),
      developer: 'Mistral AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/mistralai/Mistral-7B-v0.1',
      modelType: 'BASE',
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.4GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '5.1GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q5_K_M.gguf', recommended: false },
          { name: 'Q8_0', size: '7.7GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Mixtral 8x7B (child of Mistral 7B)
  await prisma.lLMModel.create({
    data: {
      name: 'Mixtral 8x7B',
      slug: 'mixtral-8x7b',
      description: 'Mixtral 8x7B is a Sparse Mixture of Experts (SMoE) language model. It uses 8 expert networks with a gating mechanism.',
      parameters: '46.7B (8x7B MoE)',
      releaseDate: new Date('2023-12-11'),
      developer: 'Mistral AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1',
      modelType: 'BASE',
      parentId: mistral7b.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '26.4GB', url: 'https://huggingface.co/TheBloke/Mixtral-8x7B-v0.1-GGUF/resolve/main/mixtral-8x7b-v0.1.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '32.2GB', url: 'https://huggingface.co/TheBloke/Mixtral-8x7B-v0.1-GGUF/resolve/main/mixtral-8x7b-v0.1.Q5_K_M.gguf', recommended: false },
        ]
      }
    }
  })

  // Create Japanese StableLM (standalone)
  await prisma.lLMModel.create({
    data: {
      name: 'Japanese StableLM Base Gamma 7B',
      slug: 'japanese-stablelm-base-gamma-7b',
      description: 'Japanese StableLM Base Gamma 7B is a 7B parameter decoder-only language model pre-trained on a diverse collection of Japanese and English datasets.',
      parameters: '7B',
      releaseDate: new Date('2024-01-18'),
      developer: 'Stability AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/stabilityai/japanese-stablelm-base-gamma-7b',
      modelType: 'BASE',
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.4GB', url: 'https://huggingface.co/mmnga/japanese-stablelm-base-gamma-7b-gguf/resolve/main/japanese-stablelm-base-gamma-7b-Q4_K_M.gguf', recommended: true },
          { name: 'Q8_0', size: '7.7GB', url: 'https://huggingface.co/mmnga/japanese-stablelm-base-gamma-7b-gguf/resolve/main/japanese-stablelm-base-gamma-7b-Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
