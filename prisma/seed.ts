import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.gGUFFile.deleteMany()
  await prisma.lLMModel.deleteMany()

  // ============================================
  // Llama Family (Meta)
  // ============================================

  // Llama - Root family
  const llama = await prisma.lLMModel.create({
    data: {
      name: 'Llama',
      slug: 'llama',
      description: 'Llama is a family of large language models developed by Meta. Known for being open-source and highly capable.',
      developer: 'Meta',
      modelType: 'BASE',
    }
  })

  // Llama 2 - Version
  const llama2 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2',
      slug: 'llama-2',
      description: 'Llama 2 is the second generation of Llama models, offering improved performance and longer context length.',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  // Llama 2 70B - Parameter variant
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 2 70B',
      slug: 'llama-2-70b',
      description: 'The largest Llama 2 model with 70 billion parameters. Best performance but requires significant compute resources.',
      parameters: '70B',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-2-70b',
      modelType: 'BASE',
      parentId: llama2.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '40.0GB', url: 'https://huggingface.co/TheBloke/Llama-2-70B-GGUF/resolve/main/llama-2-70b.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '48.5GB', url: 'https://huggingface.co/TheBloke/Llama-2-70B-GGUF/resolve/main/llama-2-70b.Q5_K_M.gguf', recommended: false },
        ]
      }
    }
  })

  // Llama 3 - Version
  const llama3 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3',
      slug: 'llama-3',
      description: 'Llama 3 is the third generation with significant improvements in reasoning and instruction following.',
      releaseDate: new Date('2024-04-18'),
      developer: 'Meta',
      license: 'Llama 3 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  // Llama 3 8B - Parameter variant
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
      parentId: llama3.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.9GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '5.7GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q5_K_M.gguf', recommended: false },
          { name: 'Q8_0', size: '8.5GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-GGUF/resolve/main/Meta-Llama-3-8B.Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // Llama 3 70B - Parameter variant
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 70B',
      slug: 'llama-3-70b',
      description: 'The largest Llama 3 model with 70 billion parameters. State-of-the-art performance across various benchmarks.',
      parameters: '70B',
      releaseDate: new Date('2024-04-18'),
      developer: 'Meta',
      license: 'Llama 3 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3-70B',
      modelType: 'BASE',
      parentId: llama3.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '42.5GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-70B-GGUF/resolve/main/Meta-Llama-3-70B.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '51.2GB', url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-70B-GGUF/resolve/main/Meta-Llama-3-70B.Q5_K_M.gguf', recommended: false },
        ]
      }
    }
  })

  // Llama 3 Japanese 8B - Fine-tune of Llama 3 8B
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 ELYZA JP 8B',
      slug: 'llama-3-elyza-jp-8b',
      description: 'Japanese language fine-tuned version of Llama 3 8B by ELYZA. Optimized for Japanese text generation and understanding.',
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

  // ============================================
  // Mistral Family (Mistral AI)
  // ============================================

  // Mistral - Root family
  const mistral = await prisma.lLMModel.create({
    data: {
      name: 'Mistral',
      slug: 'mistral',
      description: 'Mistral is a family of efficient, high-performance language models developed by Mistral AI.',
      developer: 'Mistral AI',
      modelType: 'BASE',
    }
  })

  // Mistral 7B - Parameter variant
  await prisma.lLMModel.create({
    data: {
      name: 'Mistral 7B',
      slug: 'mistral-7b',
      description: 'Mistral 7B is a 7.3B parameter model that outperforms Llama 2 13B on all benchmarks.',
      parameters: '7B',
      releaseDate: new Date('2023-09-27'),
      developer: 'Mistral AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/mistralai/Mistral-7B-v0.1',
      modelType: 'BASE',
      parentId: mistral.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.4GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '5.1GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q5_K_M.gguf', recommended: false },
          { name: 'Q8_0', size: '7.7GB', url: 'https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/resolve/main/mistral-7b-v0.1.Q8_0.gguf', recommended: false },
        ]
      }
    }
  })

  // ============================================
  // Mixtral Family (Mistral AI - different architecture)
  // ============================================

  // Mixtral - Root family (MoE architecture)
  const mixtral = await prisma.lLMModel.create({
    data: {
      name: 'Mixtral',
      slug: 'mixtral',
      description: 'Mixtral is a Mixture of Experts (MoE) model family by Mistral AI, offering high performance with efficient inference.',
      developer: 'Mistral AI',
      modelType: 'BASE',
    }
  })

  // Mixtral 8x7B - Parameter variant
  await prisma.lLMModel.create({
    data: {
      name: 'Mixtral 8x7B',
      slug: 'mixtral-8x7b',
      description: 'Mixtral 8x7B is a Sparse Mixture of Experts (SMoE) model with 8 expert networks. Total 46.7B parameters but only uses ~13B per token.',
      parameters: '46.7B (8x7B MoE)',
      releaseDate: new Date('2023-12-11'),
      developer: 'Mistral AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1',
      modelType: 'BASE',
      parentId: mixtral.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '26.4GB', url: 'https://huggingface.co/TheBloke/Mixtral-8x7B-v0.1-GGUF/resolve/main/mixtral-8x7b-v0.1.Q4_K_M.gguf', recommended: true },
          { name: 'Q5_K_M', size: '32.2GB', url: 'https://huggingface.co/TheBloke/Mixtral-8x7B-v0.1-GGUF/resolve/main/mixtral-8x7b-v0.1.Q5_K_M.gguf', recommended: false },
        ]
      }
    }
  })

  // ============================================
  // Japanese StableLM Family (Stability AI)
  // ============================================

  // Japanese StableLM - Root family
  const japaneseStableLM = await prisma.lLMModel.create({
    data: {
      name: 'Japanese StableLM',
      slug: 'japanese-stablelm',
      description: 'Japanese StableLM is a family of Japanese language models developed by Stability AI.',
      developer: 'Stability AI',
      modelType: 'BASE',
    }
  })

  // Japanese StableLM Base Gamma 7B - Parameter variant
  await prisma.lLMModel.create({
    data: {
      name: 'Japanese StableLM Base Gamma 7B',
      slug: 'japanese-stablelm-base-gamma-7b',
      description: 'A 7B parameter decoder-only language model pre-trained on a diverse collection of Japanese and English datasets.',
      parameters: '7B',
      releaseDate: new Date('2024-01-18'),
      developer: 'Stability AI',
      license: 'Apache 2.0',
      huggingface: 'https://huggingface.co/stabilityai/japanese-stablelm-base-gamma-7b',
      modelType: 'BASE',
      parentId: japaneseStableLM.id,
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
