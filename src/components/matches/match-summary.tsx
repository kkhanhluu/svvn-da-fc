import { ReactNode } from 'react';
import { CompetitionTeam, UserProfile } from '../../types';
import { DetailItem, DetailList } from '../detail-list';
import { MatchEvents, MatchEventWithPlayers } from './match-events';

export type { MatchEventWithPlayers };

export function MatchSummary({
  matchId,
  events,
  teams,
  members,
  canEdit,
  infoItems,
  motm,
}: {
  matchId: number;
  events: MatchEventWithPlayers[];
  teams: CompetitionTeam[];
  members: UserProfile[];
  canEdit: boolean;
  infoItems: DetailItem[];
  motm: ReactNode;
}) {
  return (
    <div className='grid gap-4 lg:grid-cols-[1fr_360px] items-start'>
      <MatchEvents
        matchId={matchId}
        events={events}
        teams={teams}
        members={members}
        canEdit={canEdit}
      />

      <div className='space-y-4'>
        <DetailList items={infoItems} title='Thông tin trận đấu' />
        {motm}
      </div>
    </div>
  );
}
