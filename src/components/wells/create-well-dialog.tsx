import { useState, useEffect } from 'react'
import { WellTargetService } from '../../api/wells'
import { ProjectsService } from '../../api/projects'
import { ReservoirService } from '../../api/reservoirs'
import { TypeWellService } from '../../api/type_well'
import { TypeTubingService } from '../../api/type-tubings'
import { TypeFunctionService } from '../../api/type-functions'
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
import type { 
  WellTargetResponse, 
  ProjectsResponse, 
  ReservoirResponse,
  TypeWellResponse,
  TypeTubingResponse,
  TypeFunctionResponse
} from '@/types/api'

interface WellFormData {
  name: string
  project_id: string
  reservoir_details_id: number | null
  type_well_targets_id: number | null
  type_tubings_id: number | null
  type_functions_id: number | null
  entry_point_x: number
  entry_point_y: number
  entry_point_z: number
  target_x: number
  target_y: number
  target_z: number
  tec: number
}

interface CreateWellDialogProps {
  open: boolean
  onClose: () => void
  onWellCreated: () => void
  mode?: 'create' | 'edit'
  wellToEdit?: WellTargetResponse | null
  selectedReservoirId?: number | null
}

export const CreateWellDialog = ({ 
  open, 
  onClose, 
  onWellCreated, 
  mode = 'create',
  wellToEdit = null,
  selectedReservoirId = null
}: CreateWellDialogProps) => {
  const [formData, setFormData] = useState<WellFormData>({
    name: '',
    project_id: '',
    reservoir_details_id: null,
    type_well_targets_id: null,
    type_tubings_id: null,
    type_functions_id: null,
    entry_point_x: 0,
    entry_point_y: 0,
    entry_point_z: 0,
    target_x: 0,
    target_y: 0,
    target_z: 0,
    tec: 0
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [projects, setProjects] = useState<ProjectsResponse[]>([])
  const [reservoirs, setReservoirs] = useState<ReservoirResponse[]>([])
  const [typeWells, setTypeWells] = useState<TypeWellResponse[]>([])
  const [typeTubings, setTypeTubings] = useState<TypeTubingResponse[]>([])
  const [typeFunctions, setTypeFunctions] = useState<TypeFunctionResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return
      
      try {
        setLoading(true)
        const [projectsData, reservoirsData, typeWellsData, typeTubingsData, typeFunctionsData] = await Promise.all([
          ProjectsService.getAll(),
          ReservoirService.getAll(),
          TypeWellService.getAll(),
          TypeTubingService.getAll(),
          TypeFunctionService.getAll()
        ])
        
        setProjects(projectsData)
        setReservoirs(reservoirsData)
        setTypeWells(typeWellsData)
        setTypeTubings(typeTubingsData)
        setTypeFunctions(typeFunctionsData)
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err)
        toast.error('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open])

  useEffect(() => {
    if (mode === 'edit' && wellToEdit && open) {
      setFormData({
        name: wellToEdit.name,
        project_id: wellToEdit.project_id,
        reservoir_details_id: wellToEdit.reservoir_details_id,
        type_well_targets_id: wellToEdit.type_well_targets_id,
        type_tubings_id: wellToEdit.type_tubings_id,
        type_functions_id: wellToEdit.type_functions_id,
        entry_point_x: wellToEdit.entry_point_x,
        entry_point_y: wellToEdit.entry_point_y,
        entry_point_z: wellToEdit.entry_point_z,
        target_x: wellToEdit.target_x,
        target_y: wellToEdit.target_y,
        target_z: wellToEdit.target_z,
        tec: wellToEdit.tec
      })
    } else if (mode === 'create' && open) {
      resetForm()
      if (selectedReservoirId) {
        setFormData(prev => ({ ...prev, reservoir_details_id: selectedReservoirId }))
      }
    }
  }, [mode, wellToEdit, open, selectedReservoirId])

  const handleSubmitWell = async () => {
    if (!formData.name || !formData.project_id || !formData.reservoir_details_id || 
        !formData.type_well_targets_id || !formData.type_tubings_id || !formData.type_functions_id) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setIsCreating(true)
      
      if (mode === 'create') {
        await WellTargetService.create({
          name: formData.name,
          project_id: formData.project_id,
          reservoir_details_id: formData.reservoir_details_id!,
          type_well_targets_id: formData.type_well_targets_id!,
          type_tubings_id: formData.type_tubings_id!,
          type_functions_id: formData.type_functions_id!,
          entry_point_x: formData.entry_point_x,
          entry_point_y: formData.entry_point_y,
          entry_point_z: formData.entry_point_z,
          target_x: formData.target_x,
          target_y: formData.target_y,
          target_z: formData.target_z,
          tec: formData.tec
        })
        toast.success('Poço criado com sucesso!')
      } else {
        await WellTargetService.update(wellToEdit!.id, {
          name: formData.name,
          type_well_targets_id: formData.type_well_targets_id!,
          type_tubings_id: formData.type_tubings_id!,
          type_functions_id: formData.type_functions_id!,
          entry_point_x: formData.entry_point_x,
          entry_point_y: formData.entry_point_y,
          entry_point_z: formData.entry_point_z,
          target_x: formData.target_x,
          target_y: formData.target_y,
          target_z: formData.target_z,
          tec: formData.tec
        })
        toast.success('Poço atualizado com sucesso!')
      }
      
      resetForm()
      onWellCreated()
      onClose()
      
    } catch (err: any) {
      console.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} poço:`, err)
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} poço`)
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = (): void => {
    setFormData({
      name: '',
      project_id: '',
      reservoir_details_id: null,
      type_well_targets_id: null,
      type_tubings_id: null,
      type_functions_id: null,
      entry_point_x: 0,
      entry_point_y: 0,
      entry_point_z: 0,
      target_x: 0,
      target_y: 0,
      target_z: 0,
      tec: 0
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const updateFormField = <K extends keyof WellFormData>(
    field: K,
    value: WellFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Carregando dados...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Novo Poço' : 'Editar Poço'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Preencha as informações do novo poço.' 
              : 'Atualize as informações do poço.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Poço *
            </label>
            <Input
              id="name"
              placeholder="Digite o nome do poço"
              value={formData.name}
              onChange={(e) => updateFormField('name', e.target.value)}
            />
          </div>

          {mode === 'create' && (
            <>
              <div>
                <label htmlFor="project" className="text-sm font-medium">
                  Projeto *
                </label>
                <Select 
                  value={formData.project_id} 
                  onValueChange={(value) => updateFormField('project_id', value)}
                >
                  <SelectTrigger className="w-full">
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

              <div>
                <label htmlFor="reservoir" className="text-sm font-medium">
                  Reservatório *
                </label>
                <Select 
                  value={formData.reservoir_details_id?.toString() || ''} 
                  onValueChange={(value) => updateFormField('reservoir_details_id', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um reservatório" />
                  </SelectTrigger>
                  <SelectContent>
                    {reservoirs.map((reservoir) => (
                      <SelectItem key={reservoir.id} value={reservoir.id.toString()}>
                        {reservoir.name_reservoir}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium">Tipo de Poço *</label>
            <Select 
              value={formData.type_well_targets_id?.toString() || ''} 
              onValueChange={(value) => updateFormField('type_well_targets_id', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeWells.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Tubulação *</label>
            <Select 
              value={formData.type_tubings_id?.toString() || ''} 
              onValueChange={(value) => updateFormField('type_tubings_id', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeTubings.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Função *</label>
            <Select 
              value={formData.type_functions_id?.toString() || ''} 
              onValueChange={(value) => updateFormField('type_functions_id', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeFunctions.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">TEC</label>
            <Input
              type="number"
              step="0.01"
              value={formData.tec}
              onChange={(e) => updateFormField('tec', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-medium mb-2">Ponto de Entrada</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600">X</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.entry_point_x}
                  onChange={(e) => updateFormField('entry_point_x', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Y</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.entry_point_y}
                  onChange={(e) => updateFormField('entry_point_y', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Z</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.entry_point_z}
                  onChange={(e) => updateFormField('entry_point_z', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-medium mb-2">Alvo</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600">X</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.target_x}
                  onChange={(e) => updateFormField('target_x', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Y</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.target_y}
                  onChange={(e) => updateFormField('target_y', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Z</label>
                <Input
                  type="number"
                  step="1"
                  value={formData.target_z}
                  onChange={(e) => updateFormField('target_z', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
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
            onClick={handleSubmitWell}
            disabled={isCreating}
            className='cursor-pointer'
          >
            {isCreating 
              ? (mode === 'create' ? 'Criando...' : 'Atualizando...') 
              : (mode === 'create' ? 'Criar Poço' : 'Atualizar Poço')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}