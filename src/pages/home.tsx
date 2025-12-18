import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ProjectsService } from '@/api/projects';
import { ReservoirService } from '@/api/reservoirs';
import { WellTargetService } from '@/api/wells';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalProjects: number;
  totalReservoirs: number;
  totalWells: number;
  reservoirWellsData: Array<{
    reservoirName: string;
    wellCount: number;
  }>;
}

const Home = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalReservoirs: 0,
    totalWells: 0,
    reservoirWellsData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [projects, reservoirs, wells] = await Promise.all([
          ProjectsService.getAll(),
          ReservoirService.getAll(),
          WellTargetService.getAll()
        ]);

const reservoirWellsMap = new Map<number, { name: string; count: number }>();
        
        reservoirs.forEach(reservoir => {
          reservoirWellsMap.set(reservoir.id, {
            name: reservoir.name_reservoir,
            count: 0
          });
        });

        wells.forEach(well => {
          if (well.reservoir_details_id && reservoirWellsMap.has(well.reservoir_details_id)) {
            const current = reservoirWellsMap.get(well.reservoir_details_id)!;
            reservoirWellsMap.set(well.reservoir_details_id, {
              ...current,
              count: current.count + 1
            });
          }
        });

        const reservoirWellsData = Array.from(reservoirWellsMap.values()).map(item => ({
          reservoirName: item.name,
          wellCount: item.count
        }));

        setStats({
          totalProjects: projects.length,
          totalReservoirs: reservoirs.length,
          totalWells: wells.length,
          reservoirWellsData
        });

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const DashboardHeader = () => (
    <div className="border-b border-slate-200 pb-4">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-600 mt-2">
        Bem-vindo ao DeepReserver - Sistema de Gestão de Reservatórios
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Projetos</h3>
          <p className="text-3xl font-bold text-cyan-600">{stats.totalProjects}</p>
          <p className="text-sm text-slate-600 mt-1">Total de projetos</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Reservatórios</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalReservoirs}</p>
          <p className="text-sm text-slate-600 mt-1">Em monitoramento</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Poços</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalWells}</p>
          <p className="text-sm text-slate-600 mt-1">Total de poços</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribuição de Poços por Reservatório</h3>
          <div className="h-64 flex items-center justify-center">
            {stats.reservoirWellsData.filter(item => item.wellCount > 0).length > 0 ? (
              <Doughnut
                data={{
                  labels: stats.reservoirWellsData
                    .filter(item => item.wellCount > 0)
                    .map(item => item.reservoirName),
                  datasets: [
                    {
                      data: stats.reservoirWellsData
                        .filter(item => item.wellCount > 0)
                        .map(item => item.wellCount),
                      backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6',
                        '#06B6D4',
                        '#F97316',
                        '#84CC16',
                      ],
                      borderWidth: 2,
                      borderColor: '#ffffff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          return `${label}: ${value} poço${value !== 1 ? 's' : ''}`;
                        }
                      }
                    }
                  },
                }}
              />
            ) : (
              <p className="text-slate-600">Nenhum poço cadastrado</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumo Geral</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: ['Projetos', 'Reservatórios', 'Poços'],
                datasets: [
                  {
                    label: 'Quantidade',
                    data: [stats.totalProjects, stats.totalReservoirs, stats.totalWells],
                    backgroundColor: ['#06B6D4', '#3B82F6', '#10B981'],
                    borderColor: ['#0891B2', '#2563EB', '#059669'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        return `${context.label}: ${value}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Reservatórios x Poços</h3>
        {stats.reservoirWellsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Reservatório</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Quantidade de Poços</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.reservoirWellsData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{item.reservoirName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.wellCount > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.wellCount} poço{item.wellCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.wellCount > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.wellCount > 0 ? 'Ativo' : 'Sem poços'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600">Nenhum dado disponível</p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => window.location.href = '/projects'}>Gerenciar Projetos</Button>
          <Button variant="outline" onClick={() => window.location.href = '/reservoirs'}>Gerenciar Reservatórios</Button>
          <Button variant="outline" onClick={() => window.location.href = '/wells'}>Gerenciar Poços</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;