import { Database } from '../../database.types';

export type UserProfile = Database['public']['Tables']['users']['Row'];
export type Training = Database['public']['Tables']['trainings']['Row'];
export type EventWithTraining =
  Database['public']['Functions']['get_events_for_attendee']['Returns'][0];
