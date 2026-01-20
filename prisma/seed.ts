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

  // ----------------------------------------
  // Llama 1 (Feb 2023) - Research only
  // ----------------------------------------
  const llama1 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 1',
      slug: 'llama-1',
      description: 'The original LLaMA, released for research purposes only. Not commercially available.',
      releaseDate: new Date('2023-02-24'),
      developer: 'Meta',
      license: 'Research Only (Non-commercial)',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  // Llama 1 parameter variants
  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Llama 1 7B',
        slug: 'llama-1-7b',
        description: 'The smallest Llama 1 model with 7 billion parameters.',
        parameters: '7B',
        releaseDate: new Date('2023-02-24'),
        developer: 'Meta',
        license: 'Research Only (Non-commercial)',
        modelType: 'BASE',
        parentId: llama1.id,
      },
      {
        name: 'Llama 1 13B',
        slug: 'llama-1-13b',
        description: 'Llama 1 13B outperformed GPT-3 (175B) on many benchmarks.',
        parameters: '13B',
        releaseDate: new Date('2023-02-24'),
        developer: 'Meta',
        license: 'Research Only (Non-commercial)',
        modelType: 'BASE',
        parentId: llama1.id,
      },
      {
        name: 'Llama 1 33B',
        slug: 'llama-1-33b',
        description: 'Llama 1 with 33 billion parameters.',
        parameters: '33B',
        releaseDate: new Date('2023-02-24'),
        developer: 'Meta',
        license: 'Research Only (Non-commercial)',
        modelType: 'BASE',
        parentId: llama1.id,
      },
      {
        name: 'Llama 1 65B',
        slug: 'llama-1-65b',
        description: 'The largest Llama 1 model, competitive with state-of-the-art models like PaLM.',
        parameters: '65B',
        releaseDate: new Date('2023-02-24'),
        developer: 'Meta',
        license: 'Research Only (Non-commercial)',
        modelType: 'BASE',
        parentId: llama1.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 2 (Jul 2023) - Commercially available
  // ----------------------------------------
  const llama2 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2',
      slug: 'llama-2',
      description: 'Llama 2 is the second generation, offering commercial availability and improved performance. Trained on 2 trillion tokens with 4096 context length.',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  // Llama 2 parameter variants
  const llama2_7b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2 7B',
      slug: 'llama-2-7b',
      description: 'The smallest Llama 2 model with 7 billion parameters.',
      parameters: '7B',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-2-7b',
      modelType: 'BASE',
      parentId: llama2.id,
    }
  })

  const llama2_13b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2 13B',
      slug: 'llama-2-13b',
      description: 'Llama 2 with 13 billion parameters.',
      parameters: '13B',
      releaseDate: new Date('2023-07-18'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-2-13b',
      modelType: 'BASE',
      parentId: llama2.id,
    }
  })

  const llama2_70b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 2 70B',
      slug: 'llama-2-70b',
      description: 'The largest Llama 2 model with 70 billion parameters. Uses Grouped-Query Attention (GQA).',
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

  // Swallow (Llama 2 based) - Tokyo Tech Japanese
  const swallow2 = await prisma.lLMModel.create({
    data: {
      name: 'Swallow',
      slug: 'swallow-llama2',
      description: 'Japanese language enhanced model based on Llama 2. Developed by Tokyo Institute of Technology.',
      releaseDate: new Date('2023-12-19'),
      developer: 'Tokyo Tech',
      license: 'Llama 2 Community License',
      modelType: 'FINETUNE',
      parentId: llama2.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Swallow 7B',
        slug: 'swallow-7b',
        parameters: '7B',
        releaseDate: new Date('2023-12-19'),
        developer: 'Tokyo Tech',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Swallow-7b-instruct-hf',
        modelType: 'FINETUNE',
        parentId: swallow2.id,
      },
      {
        name: 'Swallow 13B',
        slug: 'swallow-13b',
        parameters: '13B',
        releaseDate: new Date('2023-12-19'),
        developer: 'Tokyo Tech',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Swallow-13b-instruct-hf',
        modelType: 'FINETUNE',
        parentId: swallow2.id,
      },
      {
        name: 'Swallow 70B',
        slug: 'swallow-70b',
        parameters: '70B',
        releaseDate: new Date('2023-12-19'),
        developer: 'Tokyo Tech',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Swallow-70b-instruct-hf',
        modelType: 'FINETUNE',
        parentId: swallow2.id,
      },
    ]
  })

  // ----------------------------------------
  // Code Llama (Aug 2023) - Based on Llama 2
  // ----------------------------------------
  const codeLlama = await prisma.lLMModel.create({
    data: {
      name: 'Code Llama',
      slug: 'code-llama',
      description: 'Code Llama is a family of code-specialized models based on Llama 2. Trained on 500B additional tokens of code.',
      releaseDate: new Date('2023-08-24'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      modelType: 'FINETUNE',
      parentId: llama2.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Code Llama 7B',
        slug: 'code-llama-7b',
        parameters: '7B',
        releaseDate: new Date('2023-08-24'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/codellama/CodeLlama-7b-hf',
        modelType: 'FINETUNE',
        parentId: codeLlama.id,
      },
      {
        name: 'Code Llama 13B',
        slug: 'code-llama-13b',
        parameters: '13B',
        releaseDate: new Date('2023-08-24'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/codellama/CodeLlama-13b-hf',
        modelType: 'FINETUNE',
        parentId: codeLlama.id,
      },
      {
        name: 'Code Llama 34B',
        slug: 'code-llama-34b',
        parameters: '34B',
        releaseDate: new Date('2023-08-24'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/codellama/CodeLlama-34b-hf',
        modelType: 'FINETUNE',
        parentId: codeLlama.id,
      },
      {
        name: 'Code Llama 70B',
        slug: 'code-llama-70b',
        parameters: '70B',
        releaseDate: new Date('2024-01-29'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        huggingface: 'https://huggingface.co/codellama/CodeLlama-70b-hf',
        modelType: 'FINETUNE',
        parentId: codeLlama.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama Guard (Dec 2023) - Safety Model
  // ----------------------------------------
  await prisma.lLMModel.create({
    data: {
      name: 'Llama Guard',
      slug: 'llama-guard',
      description: 'Input/output safety classification model for content moderation. Updated through versions 1, 2, and 3.',
      releaseDate: new Date('2023-12-07'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      huggingface: 'https://huggingface.co/meta-llama/LlamaGuard-7b',
      modelType: 'FINETUNE',
      parentId: llama2.id,
    }
  })

  // ----------------------------------------
  // Spirit LM (Oct 2024) - Audio/Text Model
  // ----------------------------------------
  const spiritLm = await prisma.lLMModel.create({
    data: {
      name: 'Spirit LM',
      slug: 'spirit-lm',
      description: 'Audio/text integrated model based on Llama 2. Can handle speech emotion and intonation as tokens.',
      releaseDate: new Date('2024-10-01'),
      developer: 'Meta',
      license: 'Llama 2 Community License',
      modelType: 'FINETUNE',
      parentId: llama2.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Spirit LM Base',
        slug: 'spirit-lm-base',
        description: 'Base version of Spirit LM for audio/text tasks.',
        releaseDate: new Date('2024-10-01'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        modelType: 'FINETUNE',
        parentId: spiritLm.id,
      },
      {
        name: 'Spirit LM Expressive',
        slug: 'spirit-lm-expressive',
        description: 'Expressive version with enhanced emotion handling.',
        releaseDate: new Date('2024-10-01'),
        developer: 'Meta',
        license: 'Llama 2 Community License',
        modelType: 'FINETUNE',
        parentId: spiritLm.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 3 (Apr 2024)
  // ----------------------------------------
  const llama3 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3',
      slug: 'llama-3',
      description: 'Third generation Llama with significant improvements in reasoning and instruction following. 8K context length.',
      releaseDate: new Date('2024-04-18'),
      developer: 'Meta',
      license: 'Llama 3 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  const llama3_8b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 8B',
      slug: 'llama-3-8b',
      description: 'Llama 3 with 8 billion parameters. Excellent performance for its size.',
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

  const llama3_70b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 70B',
      slug: 'llama-3-70b',
      description: 'Llama 3 with 70 billion parameters. State-of-the-art open model at release.',
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
        ]
      }
    }
  })

  // ELYZA Japanese (Llama 3)
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 ELYZA JP 8B',
      slug: 'llama-3-elyza-jp-8b',
      description: 'Japanese language fine-tuned version of Llama 3 8B by ELYZA. Performance comparable to GPT-3.5 Turbo in Japanese.',
      parameters: '8B',
      releaseDate: new Date('2024-06-01'),
      developer: 'ELYZA',
      license: 'Llama 3 Community License',
      huggingface: 'https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B',
      modelType: 'FINETUNE',
      parentId: llama3_8b.id,
      ggufFiles: {
        create: [
          { name: 'Q4_K_M', size: '4.9GB', url: 'https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF/resolve/main/Llama-3-ELYZA-JP-8B-Q4_K_M.gguf', recommended: true },
        ]
      }
    }
  })

  // Swallow (Llama 3)
  const swallow3 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3 Swallow',
      slug: 'llama-3-swallow',
      description: 'Japanese enhanced Llama 3 by Tokyo Institute of Technology.',
      releaseDate: new Date('2024-07-01'),
      developer: 'Tokyo Tech',
      license: 'Llama 3 Community License',
      modelType: 'FINETUNE',
      parentId: llama3.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Llama 3 Swallow 8B',
        slug: 'llama-3-swallow-8b',
        parameters: '8B',
        releaseDate: new Date('2024-07-01'),
        developer: 'Tokyo Tech',
        license: 'Llama 3 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Llama-3-Swallow-8B-Instruct-v0.1',
        modelType: 'FINETUNE',
        parentId: swallow3.id,
      },
      {
        name: 'Llama 3 Swallow 70B',
        slug: 'llama-3-swallow-70b',
        parameters: '70B',
        releaseDate: new Date('2024-07-01'),
        developer: 'Tokyo Tech',
        license: 'Llama 3 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Llama-3-Swallow-70B-Instruct-v0.1',
        modelType: 'FINETUNE',
        parentId: swallow3.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 3.1 (Jul 2024) - 128K context
  // ----------------------------------------
  const llama31 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.1',
      slug: 'llama-3-1',
      description: 'Extended context length to 128K tokens. Multilingual support for 8 languages. 405B is the largest open model.',
      releaseDate: new Date('2024-07-23'),
      developer: 'Meta',
      license: 'Llama 3.1 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  const llama31_8b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.1 8B',
      slug: 'llama-3-1-8b',
      parameters: '8B',
      releaseDate: new Date('2024-07-23'),
      developer: 'Meta',
      license: 'Llama 3.1 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3.1-8B',
      modelType: 'BASE',
      parentId: llama31.id,
    }
  })

  const llama31_70b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.1 70B',
      slug: 'llama-3-1-70b',
      parameters: '70B',
      releaseDate: new Date('2024-07-23'),
      developer: 'Meta',
      license: 'Llama 3.1 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3.1-70B',
      modelType: 'BASE',
      parentId: llama31.id,
    }
  })

  const llama31_405b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.1 405B',
      slug: 'llama-3-1-405b',
      description: 'The largest open-source model at release. Frontier-level performance.',
      parameters: '405B',
      releaseDate: new Date('2024-07-23'),
      developer: 'Meta',
      license: 'Llama 3.1 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Meta-Llama-3.1-405B',
      modelType: 'BASE',
      parentId: llama31.id,
    }
  })

  // Swallow (Llama 3.1)
  const swallow31 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.1 Swallow',
      slug: 'llama-3-1-swallow',
      description: 'Japanese enhanced Llama 3.1 by Tokyo Institute of Technology. State-of-the-art Japanese performance.',
      releaseDate: new Date('2024-10-08'),
      developer: 'Tokyo Tech',
      license: 'Llama 3.1 Community License',
      modelType: 'FINETUNE',
      parentId: llama31.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Llama 3.1 Swallow 8B',
        slug: 'llama-3-1-swallow-8b',
        parameters: '8B',
        releaseDate: new Date('2024-12-23'),
        developer: 'Tokyo Tech',
        license: 'Llama 3.1 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Llama-3.1-Swallow-8B-Instruct-v0.3',
        modelType: 'FINETUNE',
        parentId: swallow31.id,
      },
      {
        name: 'Llama 3.1 Swallow 70B',
        slug: 'llama-3-1-swallow-70b',
        parameters: '70B',
        releaseDate: new Date('2024-12-30'),
        developer: 'Tokyo Tech',
        license: 'Llama 3.1 Community License',
        huggingface: 'https://huggingface.co/tokyotech-llm/Llama-3.1-Swallow-70B-Instruct-v0.3',
        modelType: 'FINETUNE',
        parentId: swallow31.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 3.2 (Sep 2024) - Multimodal & Edge
  // ----------------------------------------
  const llama32 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.2',
      slug: 'llama-3-2',
      description: 'Multimodal capabilities with vision models and lightweight edge models.',
      releaseDate: new Date('2024-09-25'),
      developer: 'Meta',
      license: 'Llama 3.2 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'Llama 3.2 1B',
        slug: 'llama-3-2-1b',
        description: 'Lightweight text model for smartphones and edge devices.',
        parameters: '1B',
        releaseDate: new Date('2024-09-25'),
        developer: 'Meta',
        license: 'Llama 3.2 Community License',
        huggingface: 'https://huggingface.co/meta-llama/Llama-3.2-1B',
        modelType: 'BASE',
        parentId: llama32.id,
      },
      {
        name: 'Llama 3.2 3B',
        slug: 'llama-3-2-3b',
        description: 'Lightweight text model for edge deployment.',
        parameters: '3B',
        releaseDate: new Date('2024-09-25'),
        developer: 'Meta',
        license: 'Llama 3.2 Community License',
        huggingface: 'https://huggingface.co/meta-llama/Llama-3.2-3B',
        modelType: 'BASE',
        parentId: llama32.id,
      },
      {
        name: 'Llama 3.2 11B Vision',
        slug: 'llama-3-2-11b-vision',
        description: 'Multimodal model with image understanding capabilities.',
        parameters: '11B',
        releaseDate: new Date('2024-09-25'),
        developer: 'Meta',
        license: 'Llama 3.2 Community License',
        huggingface: 'https://huggingface.co/meta-llama/Llama-3.2-11B-Vision',
        modelType: 'BASE',
        parentId: llama32.id,
      },
      {
        name: 'Llama 3.2 90B Vision',
        slug: 'llama-3-2-90b-vision',
        description: 'Large multimodal model with advanced image understanding.',
        parameters: '90B',
        releaseDate: new Date('2024-09-25'),
        developer: 'Meta',
        license: 'Llama 3.2 Community License',
        huggingface: 'https://huggingface.co/meta-llama/Llama-3.2-90B-Vision',
        modelType: 'BASE',
        parentId: llama32.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 3.3 (Dec 2024) - Distilled from 405B
  // ----------------------------------------
  const llama33 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.3',
      slug: 'llama-3-3',
      description: 'Distilled version condensing 405B capabilities into 70B. The culmination of Llama 3 series.',
      releaseDate: new Date('2024-12-06'),
      developer: 'Meta',
      license: 'Llama 3.3 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  const llama33_70b = await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.3 70B',
      slug: 'llama-3-3-70b',
      description: 'Instruction-tuned model distilled from Llama 3.1 405B. Superior performance at lower cost.',
      parameters: '70B',
      releaseDate: new Date('2024-12-06'),
      developer: 'Meta',
      license: 'Llama 3.3 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct',
      modelType: 'BASE',
      parentId: llama33.id,
    }
  })

  // Swallow (Llama 3.3)
  await prisma.lLMModel.create({
    data: {
      name: 'Llama 3.3 Swallow 70B',
      slug: 'llama-3-3-swallow-70b',
      description: 'Japanese enhanced Llama 3.3 70B. Trained using Amazon SageMaker HyperPod.',
      parameters: '70B',
      releaseDate: new Date('2025-01-01'),
      developer: 'Tokyo Tech',
      license: 'Llama 3.3 Community License',
      huggingface: 'https://huggingface.co/tokyotech-llm/Llama-3.3-Swallow-70B-Instruct-v0.4',
      modelType: 'FINETUNE',
      parentId: llama33_70b.id,
    }
  })

  // ----------------------------------------
  // DeepSeek-R1-Distill-Llama (Jan 2025) - Not Meta official
  // ----------------------------------------
  const deepseekDistill = await prisma.lLMModel.create({
    data: {
      name: 'DeepSeek-R1-Distill-Llama',
      slug: 'deepseek-r1-distill-llama',
      description: 'Reasoning-specialized models distilled by DeepSeek from their R1 model into Llama 3 architecture. Not official Meta release but widely adopted.',
      releaseDate: new Date('2025-01-20'),
      developer: 'DeepSeek',
      license: 'MIT',
      modelType: 'FINETUNE',
      parentId: llama3.id,
    }
  })

  await prisma.lLMModel.createMany({
    data: [
      {
        name: 'DeepSeek-R1-Distill-Llama-8B',
        slug: 'deepseek-r1-distill-llama-8b',
        parameters: '8B',
        releaseDate: new Date('2025-01-20'),
        developer: 'DeepSeek',
        license: 'MIT',
        huggingface: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
        modelType: 'FINETUNE',
        parentId: deepseekDistill.id,
      },
      {
        name: 'DeepSeek-R1-Distill-Llama-70B',
        slug: 'deepseek-r1-distill-llama-70b',
        parameters: '70B',
        releaseDate: new Date('2025-01-20'),
        developer: 'DeepSeek',
        license: 'MIT',
        huggingface: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
        modelType: 'FINETUNE',
        parentId: deepseekDistill.id,
      },
    ]
  })

  // ----------------------------------------
  // Llama 4 (Apr 2025) - MoE Architecture
  // ----------------------------------------
  const llama4 = await prisma.lLMModel.create({
    data: {
      name: 'Llama 4',
      slug: 'llama-4',
      description: 'Fourth generation with Mixture of Experts (MoE) architecture. Natively multimodal with unprecedented context windows.',
      releaseDate: new Date('2025-04-05'),
      developer: 'Meta',
      license: 'Llama 4 Community License',
      modelType: 'BASE',
      parentId: llama.id,
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Llama 4 Scout',
      slug: 'llama-4-scout',
      description: 'High-efficiency general-purpose model. 16 experts, 10M token context window. Runs on single H100 GPU.',
      parameters: '109B MoE (17B active)',
      releaseDate: new Date('2025-04-05'),
      developer: 'Meta',
      license: 'Llama 4 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E',
      modelType: 'BASE',
      parentId: llama4.id,
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Llama 4 Maverick',
      slug: 'llama-4-maverick',
      description: 'Enhanced reasoning and coding model. 128 experts, 1M token context. Requires H100 DGX system.',
      parameters: '400B MoE (17B active)',
      releaseDate: new Date('2025-04-05'),
      developer: 'Meta',
      license: 'Llama 4 Community License',
      huggingface: 'https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E',
      modelType: 'BASE',
      parentId: llama4.id,
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Llama 4 Behemoth',
      slug: 'llama-4-behemoth',
      description: 'Flagship model with ~2 trillion total parameters. Competes with GPT-4.5 and Gemini 2.0 Pro. Still in training.',
      parameters: '2T MoE (288B active)',
      releaseDate: new Date('2025-04-05'),
      developer: 'Meta',
      license: 'Llama 4 Community License',
      modelType: 'BASE',
      parentId: llama4.id,
    }
  })

  // ============================================
  // Mistral Family (Mistral AI)
  // ============================================

  const mistral = await prisma.lLMModel.create({
    data: {
      name: 'Mistral',
      slug: 'mistral',
      description: 'Mistral is a family of efficient, high-performance language models developed by Mistral AI.',
      developer: 'Mistral AI',
      modelType: 'BASE',
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Mistral 7B',
      slug: 'mistral-7b',
      description: 'Mistral 7B outperforms Llama 2 13B on all benchmarks despite having fewer parameters.',
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
        ]
      }
    }
  })

  // ============================================
  // Mixtral Family (Mistral AI - MoE)
  // ============================================

  const mixtral = await prisma.lLMModel.create({
    data: {
      name: 'Mixtral',
      slug: 'mixtral',
      description: 'Mixtral is a Mixture of Experts (MoE) model family by Mistral AI.',
      developer: 'Mistral AI',
      modelType: 'BASE',
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Mixtral 8x7B',
      slug: 'mixtral-8x7b',
      description: 'Sparse Mixture of Experts with 8 expert networks. 46.7B total parameters, ~13B active per token.',
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
        ]
      }
    }
  })

  // ============================================
  // Japanese StableLM Family (Stability AI)
  // ============================================

  const japaneseStableLM = await prisma.lLMModel.create({
    data: {
      name: 'Japanese StableLM',
      slug: 'japanese-stablelm',
      description: 'Japanese StableLM is a family of Japanese language models developed by Stability AI.',
      developer: 'Stability AI',
      modelType: 'BASE',
    }
  })

  await prisma.lLMModel.create({
    data: {
      name: 'Japanese StableLM Base Gamma 7B',
      slug: 'japanese-stablelm-base-gamma-7b',
      description: 'A 7B parameter decoder-only language model pre-trained on Japanese and English datasets.',
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
