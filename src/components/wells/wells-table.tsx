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
import type { WellTargetResponse } from '@/types/api'
import { Edit, Trash2 } from 'lucide-react'

interface WellWithReservoirName extends WellTargetResponse {
  reservoirName?: string
}

interface WellsTableProps {
  wells: WellWithReservoirName[]
  loading: boolean
  onEditWell: (wellId: number) => void
  onDeleteWell: (wellId: number) => void
}

export const WellsTable = ({ 
  wells, 
  loading,
  onEditWell, 
  onDeleteWell 
}: WellsTableProps) => {
  if (loading) {
    return <div className="h-full flex items-center justify-center">
      <Spinner className="size-8 text-blue-500" />
    </div>
  }

  if (wells.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Nenhum poço encontrado.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow className="border-b border-slate-200">
            <TableHead className="font-semibold text-slate-700 px-6 py-4">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Nome</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Reservatório</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Ponto de Entrada</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Alvo</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">TEC</TableHead>
            <TableHead className="font-semibold text-slate-700 px-6 py-4">Data de Criação</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {wells.map((well, index) => (
            <TableRow key={well.id || index} className="border-b border-slate-200 hover:bg-slate-50">
              <TableCell className="px-6 py-4 font-medium text-slate-900">
                {well.id || index + 1}
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-900">
                {well.name || 'Nome não disponível'}
              </TableCell>

              <TableCell className="px-6 py-4">
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                  {well.reservoirName || `Reservatório ID: ${well.reservoir_details_id}`}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-600 text-sm">
                <div>
                  X: {well.entry_point_x}<br/>
                  Y: {well.entry_point_y}<br/>
                  Z: {well.entry_point_z}
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-600 text-sm">
                <div>
                  X: {well.target_x}<br/>
                  Y: {well.target_y}<br/>
                  Z: {well.target_z}
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-900 font-medium">
                {well.tec}
              </TableCell>

              <TableCell className="px-6 py-4 text-slate-600">
                {well.created_at 
                  ? new Date(well.created_at).toLocaleDateString('pt-BR')
                  : 'Data não disponível'
                }
              </TableCell>

              <TableCell className="px-2 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditWell(well.id)}
                  title="Editar poço"
                  className='cursor-pointer'
                >
                  <Edit size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteWell(well.id)}
                  title="Deletar poço"
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