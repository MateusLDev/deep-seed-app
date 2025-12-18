import { useState, useEffect } from "react";
import { WellTargetService } from "../api/wells";
import { ReservoirService } from "../api/reservoirs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { CreateWellDialog } from "../components/wells/create-well-dialog";
import { WellsTable } from "../components/wells/wells-table";
import { ConfirmDeleteDialog } from "../components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import type { WellTargetResponse, ReservoirResponse } from "@/types/api";

interface WellWithReservoirName extends WellTargetResponse {
  reservoirName?: string;
}

const Wells = () => {
  const [wells, setWells] = useState<WellWithReservoirName[]>([]);
  const [reservoirs, setReservoirs] = useState<ReservoirResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    wellToEdit: null as WellTargetResponse | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    wellId: null as number | null,
    wellName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReservoirs = async () => {
    try {
      const reservoirsData = await ReservoirService.getAll();
      setReservoirs(reservoirsData);
    } catch (err: any) {
      console.error("Erro ao buscar reservatórios:", err);
      toast.error("Erro ao carregar reservatórios");
    }
  };

  const getReservoirNameById = (
    reservoirId: number,
    reservoirsList: ReservoirResponse[]
  ): string => {
    const reservoir = reservoirsList.find((reservoir) => reservoir.id === reservoirId);
    return reservoir ? reservoir.name_reservoir : "--";
  };

  const fetchWells = async () => {
    try {
      setLoading(true);
      setError(null);

      const [wellsData, reservoirsData] = await Promise.all([
        WellTargetService.getAll(),
        reservoirs.length > 0 ? Promise.resolve(reservoirs) : ReservoirService.getAll(),
      ]);

      if (reservoirs.length === 0) {
        setReservoirs(reservoirsData);
      }

      const wellsWithReservoirNames: WellWithReservoirName[] = wellsData.map((well) => ({
        ...well,
        reservoirName: getReservoirNameById(well.reservoir_details_id, reservoirsData),
      }));

      setWells(wellsWithReservoirNames);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar poços");
      console.error("Erro ao buscar poços:", err);
      setWells([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWells();
  }, []);

  const handleWellCreated = () => {
    fetchWells();
  };

  const handleEditWell = (wellId: number) => {
    const well = wells.find((w) => w.id === wellId);
    if (well) {
      setDialogState({
        open: true,
        mode: "edit",
        wellToEdit: well,
      });
    }
  };

  const openCreateDialog = () => {
    setDialogState({
      open: true,
      mode: "create",
      wellToEdit: null,
    });
  };

  const closeDialog = () => {
    setDialogState({
      open: false,
      mode: "create",
      wellToEdit: null,
    });
  };

  const handleDeleteWell = (wellId: number) => {
    const well = wells.find((w) => w.id === wellId);
    if (well) {
      setDeleteDialog({
        open: true,
        wellId: wellId,
        wellName: well.name,
      });
    }
  };

  const confirmDeleteWell = async () => {
    if (!deleteDialog.wellId) return;

    try {
      setIsDeleting(true);
      await WellTargetService.delete(deleteDialog.wellId);

      toast.success("Poço deletado com sucesso!");

      await fetchWells();

      setDeleteDialog({ open: false, wellId: null, wellName: "" });
    } catch (err: any) {
      console.error("Erro ao deletar poço:", err);
      toast.error("Erro ao deletar poço: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteWell = () => {
    setDeleteDialog({ open: false, wellId: null, wellName: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="border-b border-slate-200 pb-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Poços</h1>
            <p className="text-slate-600 mt-2">Gerencie os poços dos seus reservatórios</p>
          </div>
        </div>

        <Button 
            className="flex items-center gap-2 cursor-pointer"
            onClick={openCreateDialog}
          >
            <Plus size={16} />
            Novo Poço
          </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Lista de Poços</h3>
        </div>

        <WellsTable
          wells={wells}
          loading={loading}
          error={error}
          onEditWell={handleEditWell}
          onDeleteWell={handleDeleteWell}
        />
      </div>

      <CreateWellDialog
        open={dialogState.open}
        onClose={closeDialog}
        onWellCreated={handleWellCreated}
        mode={dialogState.mode}
        wellToEdit={dialogState.wellToEdit}
        selectedReservoirId={null}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteWell}
        onCancel={cancelDeleteWell}
      />
    </div>
  );
};

export default Wells;
