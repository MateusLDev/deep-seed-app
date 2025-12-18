import { useState, useEffect } from 'react'
import { ProjectsService } from '../api/projects'
import { CCUSStrategiesService } from '../api/ccus-strategies'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { CreateProjectDialog } from '../components/projects/create-project-dialog'
import { ProjectsTable } from '../components/projects/projects-table'
import { ConfirmDeleteDialog } from '../components/ui/confirm-delete-dialog'
import { toast } from 'sonner'
import type { ProjectsResponse, CCUSStrategiesResponse } from '@/types/api'

interface ProjectWithStrategyName extends ProjectsResponse {
  strategyName?: string
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectWithStrategyName[]>([])
  const [ccusStrategies, setCcusStrategies] = useState<CCUSStrategiesResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit',
    projectToEdit: null as ProjectWithStrategyName | null
  })
  const [deleteDialog, setDeleteDialog] = useState({ 
    open: false, 
    projectId: null as string | number | null,
    projectName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCCUSStrategies = async () => {
    try {
      const strategies = await CCUSStrategiesService.getAll()
      setCcusStrategies(strategies)
      return strategies
    } catch (err: any) {
      console.error('Erro ao buscar estratégias CCUS:', err)
      return []
    }
  }

  const getStrategyNameById = (strategyId: number, strategies: CCUSStrategiesResponse[]): string => {
    const strategy = strategies.find(s => s.id === strategyId)
    return strategy ? strategy.name : '--'
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      const [projectsData, strategiesData] = await Promise.all([
        ProjectsService.getAll(),
        ccusStrategies.length > 0 ? Promise.resolve(ccusStrategies) : fetchCCUSStrategies()
      ])
      
      const projectsWithStrategyNames: ProjectWithStrategyName[] = projectsData.map(project => ({
        ...project,
        strategyName: getStrategyNameById(project.type_ccus_strategies_id, strategiesData)
      }))
      
      setProjects(projectsWithStrategyNames)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar projetos')
      console.error('Erro ao buscar projetos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchCCUSStrategies()
  }, [])

  const handleProjectCreated = () => {
    fetchProjects()
  }

  const handleEditProject = (projectId: string | number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setDialogState({
        open: true,
        mode: 'edit',
        projectToEdit: project
      })
    }
  }

  const openCreateDialog = () => {
    setDialogState({
      open: true,
      mode: 'create',
      projectToEdit: null
    })
  }

  const closeDialog = () => {
    setDialogState({
      open: false,
      mode: 'create',
      projectToEdit: null
    })
  }

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.project_id === projectId)

    setDeleteDialog({
      open: true,
      projectId,
      projectName: project?.name_project!
    })
  }

  const confirmDeleteProject = async () => {
    if (!deleteDialog.projectId) return

    try {
      setIsDeleting(true)
      await ProjectsService.delete(deleteDialog.projectId.toString())
      
      toast.success('Projeto deletado com sucesso!')
      
      await fetchProjects()
      
      setDeleteDialog({ open: false, projectId: null, projectName: '' })
      
    } catch (err: any) {
      console.error('Erro ao deletar projeto:', err)
      toast.error('Erro ao deletar projeto')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeleteProject = () => {
    setDeleteDialog({ open: false, projectId: null, projectName: '' })
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projetos</h1>
            <p className="text-slate-600 mt-2">
              Gerencie seus projetos de reservatórios
            </p>
          </div>

          <Button 
            className="flex items-center gap-2 cursor-pointer"
            onClick={openCreateDialog}
          >
            <Plus size={16} />
            Novo Projeto
          </Button>
        </div>
      </div>

      <CreateProjectDialog 
        open={dialogState.open}
        onClose={closeDialog}
        onProjectCreated={handleProjectCreated}
        mode={dialogState.mode}
        projectToEdit={dialogState.projectToEdit}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
      />
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Lista de Projetos</h3>
        
        <ProjectsTable 
          projects={projects}
          loading={loading}
          error={error}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </div>
  )
}

export default Projects;