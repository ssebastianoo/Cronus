export type Project = {
  id: number;
  name: string;
  is_running: boolean;
  start_time: number | null;
  last_time: number | null;
  user_id: string;
  total_time: number;
};
