import { format } from 'date-fns';
import { getCompetitionStatusLabel } from '../../helpers/competition';
import { Competition } from '../../types';
import { DetailItem, DetailList } from '../detail-list';

function formatPeriod(competition: Competition): string | null {
  const start = competition.start_date
    ? format(new Date(competition.start_date), 'dd/MM/yyyy')
    : null;
  const end = competition.end_date
    ? format(new Date(competition.end_date), 'dd/MM/yyyy')
    : null;

  if (start && end) {
    return `${start} – ${end}`;
  }
  return start ?? end;
}

export function InfoList({
  competition,
  teamCount,
}: {
  competition: Competition;
  teamCount: number;
}) {
  const period = formatPeriod(competition);

  const items: DetailItem[] = [
    {
      label: 'Thể thức',
      value:
        competition.legs === 2 ? 'Vòng tròn hai lượt' : 'Vòng tròn một lượt',
    },
    { label: 'Số đội', value: `${teamCount} đội` },
    { label: 'Trạng thái', value: getCompetitionStatusLabel(competition.status) },
  ];

  if (competition.season) {
    items.push({ label: 'Mùa giải', value: competition.season });
  }
  if (period) {
    items.push({ label: 'Thời gian', value: period });
  }
  if (competition.venue) {
    items.push({ label: 'Sân', value: competition.venue });
  }
  if (competition.organizer) {
    items.push({ label: 'Ban tổ chức', value: competition.organizer });
  }

  return <DetailList items={items} />;
}
