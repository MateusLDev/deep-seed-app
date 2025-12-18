import { useState, useEffect } from 'react'
import { ProjectsService } from '../../api/projects'
import { CCUSStrategiesService } from '../../api/ccus-strategies'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { CCUSStrategiesResponse, ProjectsResponse } from '@/types/api'

interface ProjectFormData {
  name_project: string
  type_ccus_strategies_id: number | null
}

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onProjectCreated: () => void
  mode?: 'create' | 'edit'
  projectToEdit?: ProjectsResponse | null
}

export const CreateProjectDialog = ({ 
  open, 
  onClose, 
  onProjectCreated, 
  mode = 'create',
  projectToEdit = null 
}: CreateProjectDialogProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name_project: '',
    type_ccus_strategies_id: null
  })
  const [isCreating, setIsCreating] = useState(false)  
  const [strategies, setStrategies] = useState<CCUSStrategiesResponse[]>([])
  const [loadingStrategies, setLoadingStrategies] = useState(true)

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoadingStrategies(true)
        const data = await CCUSStrategiesService.getAll()
        setStrategies(data)
      } catch (err: any) {
        console.error('Erro ao carregar estratégias:', err)
      } finally {
        setLoadingStrategies(false)
      }
    }

    if (open) {
      fetchStrategies()
    }
  }, [open])

  useEffect(() => {
    if (mode === 'edit' && projectToEdit && open) {
      setFormData({
        name_project: projectToEdit.name_project,
        type_ccus_strategies_id: projectToEdit.type_ccus_strategies_id
      })
    } else if (mode === 'create' && open) {
      resetForm()
    }
  }, [mode, projectToEdit, open])

  const handleSubmitProject = async () => {
    if (!formData.name_project || !formData.type_ccus_strategies_id) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setIsCreating(true)
      
      const projectData = {
        name_project: formData.name_project,
        type_ccus_strategies_id: Number(formData.type_ccus_strategies_id)
      }

      if (mode === 'create') {
        await ProjectsService.create(projectData)
        toast.success('Projeto criado com sucesso!')
      } else {
        await ProjectsService.update(projectToEdit!.project_id, projectData)
        toast.success('Projeto atualizado com sucesso!')
      }
      
      resetForm()
      onProjectCreated()
      onClose()
      
    } catch (err: any) {
      console.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} projeto:`, err)
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} projeto`)
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = (): void => {
    setFormData({
      name_project: '',
      type_ccus_strategies_id: null
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const updateFormField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Novo Projeto' : 'Editar Projeto'}
          </DialogTitle>

          <DialogDescription>
            {mode === 'create' 
              ? 'Preencha as informações do novo projeto de reservatório.' 
              : 'Atualize as informações do projeto de reservatório.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Projeto
            </label>
            <Input
              id="name"
              placeholder="Digite o nome do projeto"
              value={formData.name_project}
              onChange={(e) => updateFormField('name_project', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="strategy" className="text-sm font-medium">
              Estratégia CCUS
            </label>
            <Select 
              value={formData.type_ccus_strategies_id?.toString() || ''} 
              onValueChange={(value) => updateFormField('type_ccus_strategies_id', parseInt(value))}
              disabled={loadingStrategies}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Selecione uma estratégia" />
              </SelectTrigger>

              <SelectContent>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id.toString()}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isCreating}
            className='cursor-pointer'
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitProject}
            disabled={isCreating}
            className='cursor-pointer'
          >
            {isCreating 
              ? (mode === 'create' ? 'Criando...' : 'Atualizando...') 
              : (mode === 'create' ? 'Criar Projeto' : 'Atualizar Projeto')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}