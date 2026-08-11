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

      {/* Voting sits above the fixture details: it is the one card here the
          reader can act on, and on a phone everything is a single column. */}
      <div className='space-y-4'>
        {motm}
        <DetailList items={infoItems} title='Thông tin trận đấu' />
      </div>
    </div>
  );
}
