import { Database } from '../../database.types';

export type UserProfile = Database['public']['Tables']['users']['Row'];
export type Training = Database['public']['Tables']['trainings']['Row'];
export type EventForAdmin =
  Database['public']['Functions']['get_events_for_admin']['Returns'][0] & {
    attendees: string[];
  };
export type EventWithTraining =
  Database['public']['Functions']['get_events_for_attendee']['Returns'][0] & {
    attendees: string[];
  };
export type Notification = Database['public']['Tables']['notifications']['Row'];
