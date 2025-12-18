export interface ProjectsResponse {
  name_project: string;
  type_ccus_strategies_id: number;
  id: number;
  project_id: string;
  created_at: string;
}

export interface CreateProjectData {
  name_project: string;
  type_ccus_strategies_id: number;
}

export interface CCUSStrategiesResponse {
  name: string;
  description: string;
  internal_code: number;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCCUSStrategyData {
  name: string;
  description: string;
  internal_code: number;
}

export interface ReservoirResponse {
  name_reservoir: string;
  project_id: string;
  id: number;
  created_at: string;
}

export interface CreateReservoirData {
  name_reservoir: string;
  project_id: string;
}

export interface UpdateReservoirData {
  name_reservoir: string;
}
