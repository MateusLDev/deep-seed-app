import { useState, useEffect } from 'react'
import { ReservoirService } from '../../api/reservoirs'
import { ProjectsService } from '../../api/projects'
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
import type { ReservoirResponse, ProjectsResponse } from '@/types/api'

interface ReservoirFormData {
  name_reservoir: string
  project_id: string
}

interface CreateReservoirDialogProps {
  open: boolean
  onClose: () => void
  onReservoirCreated: () => void
  mode?: 'create' | 'edit'
  reservoirToEdit?: ReservoirResponse | null
}

export const CreateReservoirDialog = ({ 
  open, 
  onClose, 
  onReservoirCreated, 
  mode = 'create',
  reservoirToEdit = null 
}: CreateReservoirDialogProps) => {
  const [formData, setFormData] = useState<ReservoirFormData>({
    name_reservoir: '',
    project_id: ''
  })
  const [isCreating, setIsCreating] = useState(false)  
  const [projects, setProjects] = useState<ProjectsResponse[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true)
        const data = await ProjectsService.getAll()
        setProjects(data)
      } catch (err: any) {
        console.error('Erro ao buscar projetos:', err)
        toast.error('Erro ao carregar projetos')
      } finally {
        setLoadingProjects(false)
      }
    }

    if (open) {
      fetchProjects()
    }
  }, [open])

  useEffect(() => {
    if (mode === 'edit' && reservoirToEdit && open) {
      setFormData({
        name_reservoir: reservoirToEdit.name_reservoir,
        project_id: reservoirToEdit.project_id
      })
    } else if (mode === 'create' && open) {
      resetForm()
    }
  }, [mode, reservoirToEdit, open])

  const handleSubmitReservoir = async () => {
    if (!formData.name_reservoir || !formData.project_id) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setIsCreating(true)
      
      if (mode === 'create') {
        await ReservoirService.create({
          name_reservoir: formData.name_reservoir,
          project_id: formData.project_id
        })
        toast.success('Reservatório criado com sucesso!')
      } else {
        await ReservoirService.update(reservoirToEdit!.id, {
          name_reservoir: formData.name_reservoir
        })
        toast.success('Reservatório atualizado com sucesso!')
      }
      
      resetForm()
      onReservoirCreated()
      onClose()
      
    } catch (err: any) {
      console.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} reservatório:`, err)
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} reservatório`)
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = (): void => {
    setFormData({
      name_reservoir: '',
      project_id: ''
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const updateFormField = <K extends keyof ReservoirFormData>(
    field: K,
    value: ReservoirFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Novo Reservatório' : 'Editar Reservatório'}
          </DialogTitle>

          <DialogDescription>
            {mode === 'create' 
              ? 'Preencha as informações do novo reservatório.' 
              : 'Atualize as informações do reservatório.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Reservatório
            </label>
            <Input
              id="name"
              placeholder="Digite o nome do reservatório"
              value={formData.name_reservoir}
              onChange={(e) => updateFormField('name_reservoir', e.target.value)}
            />
          </div>

          {mode === 'create' && (
            <div className="grid gap-2">
              <label htmlFor="project" className="text-sm font-medium">
                Projeto
              </label>
              <Select 
                value={formData.project_id} 
                onValueChange={(value) => updateFormField('project_id', value)}
                disabled={loadingProjects}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>

                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.project_id}>
                      {project.name_project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isCreating}
            className='cursor-pointer mr-2'
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitReservoir}
            disabled={isCreating}
            className='cursor-pointer'
          >
            {isCreating 
              ? (mode === 'create' ? 'Criando...' : 'Atualizando...') 
              : (mode === 'create' ? 'Criar Reservatório' : 'Atualizar Reservatório')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}