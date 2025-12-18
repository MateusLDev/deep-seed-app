# API Documentation

Esta pasta contém toda a configuração e funções para comunicação com a API do ReservoirOS.

## Estrutura

```
src/lib/api/
├── client.ts          # Configuração do axios e interceptors
├── types.ts           # Tipos TypeScript para todas as entidades
├── projects.ts        # Funções para gerenciar projetos
├── reservoirs.ts      # Funções para gerenciar reservatórios
├── wells.ts           # Funções para gerenciar poços
├── index.ts           # Exportações centrais e utilities
└── README.md          # Esta documentação
```

## Configuração Base

A URL base da API é configurada em `client.ts`:
```
http://k8s-flocores-flocores-5b11a9b2c5-fa4d464bdd057a5e.elb.us-east-1.amazonaws.com/api/v1/reservoir
```

## Como usar

### Importar as APIs

```typescript
import { projectsApi, reservoirsApi, wellsApi } from '@/lib/api'
```

### Exemplos de uso

#### Projetos
```typescript
// Listar todos os projetos
const projects = await projectsApi.getAll()

// Listar projetos com filtros
const filteredProjects = await projectsApi.getAll({
  status: 'active',
  page: 1,
  limit: 10,
  search: 'projeto'
})

// Criar um novo projeto
const newProject = await projectsApi.create({
  name: 'Novo Projeto',
  description: 'Descrição do projeto',
  status: 'active'
})

// Obter projeto por ID
const project = await projectsApi.getById('project-id')

// Atualizar projeto
const updatedProject = await projectsApi.update('project-id', {
  name: 'Nome atualizado'
})

// Deletar projeto
await projectsApi.delete('project-id')
```

#### Reservatórios
```typescript
// Listar reservatórios
const reservoirs = await reservoirsApi.getAll()

// Reservatórios de um projeto específico
const projectReservoirs = await reservoirsApi.getAll({
  projectId: 'project-id'
})

// Criar reservatório
const newReservoir = await reservoirsApi.create({
  name: 'Reservatório 1',
  projectId: 'project-id',
  location: { latitude: -23.5505, longitude: -46.6333 },
  capacity: 1000000
})

// Atualizar volume
await reservoirsApi.updateVolume('reservoir-id', 750000)
```

#### Poços
```typescript
// Listar poços
const wells = await wellsApi.getAll()

// Poços de um reservatório específico
const reservoirWells = await wellsApi.getAll({
  reservoirId: 'reservoir-id'
})

// Criar poço
const newWell = await wellsApi.create({
  name: 'Poço 1',
  reservoirId: 'reservoir-id',
  projectId: 'project-id',
  location: { latitude: -23.5505, longitude: -46.6333 },
  depth: 2000
})

// Atualizar produção
await wellsApi.updateProduction('well-id', {
  daily: 100,
  monthly: 3000,
  unit: 'barrel'
})
```

## Tratamento de Erros

Todas as funções da API podem lançar erros. Use o helper `handleApiError` para tratamento consistente:

```typescript
import { projectsApi, handleApiError } from '@/lib/api'

try {
  const projects = await projectsApi.getAll()
  console.log(projects)
} catch (error) {
  const errorInfo = handleApiError(error)
  console.error('Erro ao buscar projetos:', errorInfo.message)
}
```

## Interceptors

### Request Interceptor
- Logs de requisições

### Response Interceptor
- Logs de respostas
- Tratamento automático de erros da API

## Tipos TypeScript

Todos os tipos estão definidos em `types.ts` e incluem:
- Entidades principais (Project, Reservoir, Well)
- Dados para criação e atualização
- Filtros e paginação
- Respostas da API

Isso garante type safety em todo o código que usa a API.