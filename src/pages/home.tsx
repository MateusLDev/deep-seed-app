import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Bem-vindo ao ReservoirOS - Sistema de Gestão de Reservatórios
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Projetos Ativos</h3>
          <p className="text-3xl font-bold text-cyan-600">12</p>
          <p className="text-sm text-slate-600 mt-1">+2 este mês</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Reservatórios</h3>
          <p className="text-3xl font-bold text-blue-600">48</p>
          <p className="text-sm text-slate-600 mt-1">Em monitoramento</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Poços Ativos</h3>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-slate-600 mt-1">94% operacionais</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
        <div className="flex gap-3">
          <Button>Novo Projeto</Button>
          <Button variant="outline">Ver Relatórios</Button>
          <Button variant="outline">Configurações</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;