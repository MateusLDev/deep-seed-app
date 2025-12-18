import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProjectsResponse } from '@/types/api'
import { Edit, Trash2 } from 'lucide-react'

interface ProjectWithStrategyName extends ProjectsResponse {
  strategyName?: string
}

interface ProjectsTableProps {
  projects: ProjectWithStrategyName[]
  loading: boolean
  error: string | null
  onEditProject: (projectId: string | number) => void
  onDeleteProject: (projectId: string) => void
}

export const ProjectsTable = ({ 
  projects, 
  loading, 
  error, 
  onEditProject, 
  onDeleteProject 
}: ProjectsTableProps) => {
  if (loading) {
    return <div className="h-full flex items-center justify-center">
      <Spinner className="size-8 text-blue-500" />
    </div>
  }

  if (error) {
    return <p className="text-red-600">Erro: {error}</p>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Nenhum projeto encontrado.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow className="border-b border-slate-200">
            <TableHead className="font-semibold text-slate-700 px-6 py-4">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Nome do Projeto</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Estratégia CCUS</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Data de Criação</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project: ProjectWithStrategyName, index: number) => (
            <TableRow key={project.id || index} className="border-b border-slate-200 hover:bg-slate-50">
              <TableCell className="px-6 py-4 font-medium text-slate-900">
                {project.id || index + 1}
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-900">
                {project.name_project || '--'}
              </TableCell>

              <TableCell className="px-6 py-4">
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                  {project.strategyName || `Estratégia ID: ${project.type_ccus_strategies_id}`}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-600">
                {project.created_at 
                  ? new Date(project.created_at).toLocaleDateString('pt-BR')
                  : project.created_at
                  ? new Date(project.created_at).toLocaleDateString('pt-BR')
                  : 'Data não disponível'
                }
              </TableCell>

              <TableCell className="px-2 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProject(project.id)}
                  title="Editar projeto"
                  className='cursor-pointer'
                >
                  <Edit size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteProject(project.project_id)}
                  title="Deletar projeto"
                  className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}