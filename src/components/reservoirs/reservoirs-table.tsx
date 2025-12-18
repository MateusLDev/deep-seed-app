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
import type { ReservoirResponse } from '@/types/api'
import { Edit, Trash2 } from 'lucide-react'

interface ReservoirWithProjectName extends ReservoirResponse {
  projectName?: string
}

interface ReservoirsTableProps {
  reservoirs: ReservoirWithProjectName[]
  loading: boolean
  error: string | null
  onEditReservoir: (reservoirId: number) => void
  onDeleteReservoir: (reservoirId: number) => void
}

export const ReservoirsTable = ({ 
  reservoirs, 
  loading, 
  error, 
  onEditReservoir, 
  onDeleteReservoir 
}: ReservoirsTableProps) => {
  if (loading) {
    return <div className="h-full flex items-center justify-center">
      <Spinner className="size-8 text-blue-500" />
    </div>
  }

  if (error) {
    return <p className="text-red-600">Erro: {error}</p>
  }

  if (reservoirs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Nenhum reservatório encontrado.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow className="border-b border-slate-200">
            <TableHead className="font-semibold text-slate-700 px-6 py-4">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Nome do Reservatório</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Projeto</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Data de Criação</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservoirs.map((reservoir, index) => (
            <TableRow key={reservoir.id || index} className="border-b border-slate-200 hover:bg-slate-50">
              <TableCell className="px-6 py-4 font-medium text-slate-900">
                {reservoir.id || index + 1}
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-900">
                {reservoir.name_reservoir || 'Nome não disponível'}
              </TableCell>

              <TableCell className="px-6 py-4">
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                  {reservoir.projectName || `Projeto ID: ${reservoir.project_id}`}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-600">
                {reservoir.created_at 
                  ? new Date(reservoir.created_at).toLocaleDateString('pt-BR')
                  : 'Data não disponível'
                }
              </TableCell>

              <TableCell className="px-2 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditReservoir(reservoir.id)}
                  title="Editar reservatório"
                  className='cursor-pointer'
                >
                  <Edit size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteReservoir(reservoir.id)}
                  title="Deletar reservatório"
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