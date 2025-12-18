import { useState, useEffect } from "react";
import { ReservoirService } from "../api/reservoirs";
import { ProjectsService } from "../api/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateReservoirDialog } from "../components/reservoirs/create-reservoir-dialog";
import { ReservoirsTable } from "../components/reservoirs/reservoirs-table";
import { ConfirmDeleteDialog } from "../components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import type { ReservoirResponse, ProjectsResponse } from "@/types/api";

interface ReservoirWithProjectName extends ReservoirResponse {
  projectName?: string;
}

const Reservoirs = () => {
  const [reservoirs, setReservoirs] = useState<ReservoirWithProjectName[]>([]);
  const [projects, setProjects] = useState<ProjectsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    reservoirToEdit: null as ReservoirWithProjectName | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    reservoirId: null as number | null,
    reservoirName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const projectsData = await ProjectsService.getAll();
      setProjects(projectsData);
      return projectsData;
    } catch (err: any) {
      console.error("Erro ao buscar projetos:", err);
      return [];
    }
  };

  const getProjectNameById = (projectId: string, projects: ProjectsResponse[]): string => {
    const project = projects.find((p) => p.project_id === projectId);
    return project ? project.name_project : `Projeto ID: ${projectId}`;
  };

  const fetchReservoirs = async () => {
    try {
      setLoading(true);

      const [reservoirsData, projectsData] = await Promise.all([
        ReservoirService.getAll(),
        projects.length > 0 ? Promise.resolve(projects) : fetchProjects(),
      ]);

      const reservoirsWithProjectNames: ReservoirWithProjectName[] = reservoirsData.map(
        (reservoir) => ({
          ...reservoir,
          projectName: getProjectNameById(reservoir.project_id, projectsData),
        })
      );

      setReservoirs(reservoirsWithProjectNames);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar reservatórios");
      console.error("Erro ao buscar reservatórios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservoirs();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleReservoirCreated = () => {
    fetchReservoirs();
  };

  const handleEditReservoir = (reservoirId: number) => {
    const reservoir = reservoirs.find((r) => r.id === reservoirId);
    if (reservoir) {
      setDialogState({
        open: true,
        mode: "edit",
        reservoirToEdit: reservoir,
      });
    }
  };

  const openCreateDialog = () => {
    setDialogState({
      open: true,
      mode: "create",
      reservoirToEdit: null,
    });
  };

  const closeDialog = () => {
    setDialogState({
      open: false,
      mode: "create",
      reservoirToEdit: null,
    });
  };

  const handleDeleteReservoir = (reservoirId: number) => {
    const reservoir = reservoirs.find((r) => r.id === reservoirId);
    if (reservoir) {
      setDeleteDialog({
        open: true,
        reservoirId: reservoirId,
        reservoirName: reservoir.name_reservoir,
      });
    }
  };

  const confirmDeleteReservoir = async () => {
    debugger
    if (!deleteDialog.reservoirId) return;

    try {
      setIsDeleting(true);
      await ReservoirService.delete(deleteDialog.reservoirId);

      toast.success("Reservatório deletado com sucesso!");

      await fetchReservoirs();

      setDeleteDialog({ open: false, reservoirId: null, reservoirName: "" });
    } catch (err: any) {
      console.error("Erro ao deletar reservatório:", err);
      toast.error("Erro ao deletar reservatório: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteReservoir = () => {
    setDeleteDialog({ open: false, reservoirId: null, reservoirName: "" });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reservatórios</h1>
            <p className="text-slate-600 mt-2">Gerencie seus reservatórios</p>
          </div>

          <Button className="flex items-center gap-2 cursor-pointer" onClick={openCreateDialog}>
            <Plus size={16} />
            Novo Reservatório
          </Button>
        </div>
      </div>

      <CreateReservoirDialog
        open={dialogState.open}
        onClose={closeDialog}
        onReservoirCreated={handleReservoirCreated}
        mode={dialogState.mode}
        reservoirToEdit={dialogState.reservoirToEdit}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteReservoir}
        onCancel={cancelDeleteReservoir}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Lista de Reservatórios</h3>

        <ReservoirsTable
          reservoirs={reservoirs}
          loading={loading}
          error={error}
          onEditReservoir={handleEditReservoir}
          onDeleteReservoir={handleDeleteReservoir}
        />
      </div>
    </div>
  );
};

export default Reservoirs;
