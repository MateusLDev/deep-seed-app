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
