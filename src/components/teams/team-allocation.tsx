'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';

interface Team {
  defenders: any[];
  midfielders: any[];
  forwards: any[];
}

interface PositionRequirement {
  name: 'defender' | 'midfielder' | 'forward';
  count: number;
}

interface TeamCardProps {
  team: Team;
  index: number;
}

interface TeamAllocationProps {
  players: any[];
}

export const TeamAllocation: React.FC<TeamAllocationProps> = ({ players }) => {
  const [numberOfTeams, setNumberOfTeams] = useState<2 | 3>(2);
  const [teams, setTeams] = useState<Team[]>([]);

  // Team background colors
  const teamColors = ['bg-blue-100', 'bg-green-100', 'bg-red-100'];

  const calculateTeamScore = (team: Team): number => {
    const allPlayers = [
      ...team.defenders,
      ...team.midfielders,
      ...team.forwards,
    ];
    return allPlayers.reduce((sum, player) => sum + (player.score || 0), 0);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const findBestAllocation = (players: any[], teamsCount: number): Team[] => {
    let bestAllocation: Team[] | null = null;
    let minScoreDifference = Infinity;
    const maxAttempts = 1000;

    // Calculate players per team
    const totalPlayers = players.length;
    const playersPerTeam = Math.floor(totalPlayers / teamsCount);

    if (playersPerTeam * teamsCount !== totalPlayers) {
      console.error('Cannot evenly distribute players');
      return Array.from({ length: teamsCount }, () => ({
        defenders: [],
        midfielders: [],
        forwards: [],
      }));
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Initialize empty teams
      const tempTeams: Team[] = Array.from({ length: teamsCount }, () => ({
        defenders: [],
        midfielders: [],
        forwards: [],
      }));

      // Shuffle all players together
      const shuffledPlayers = shuffleArray([...players]);

      // Distribute players evenly among teams
      for (let i = 0; i < shuffledPlayers.length; i++) {
        const teamIndex = Math.floor(i / playersPerTeam);
        const player = shuffledPlayers[i];

        // Add player to appropriate position array
        switch (player.position.trim()) {
          case 'defender':
            tempTeams[teamIndex].defenders.push(player);
            break;
          case 'midfielder':
            tempTeams[teamIndex].midfielders.push(player);
            break;
          case 'forward':
            tempTeams[teamIndex].forwards.push(player);
            break;
        }
      }

      // Calculate score difference
      const teamScores = tempTeams.map(calculateTeamScore);
      const maxScore = Math.max(...teamScores);
      const minScore = Math.min(...teamScores);
      const scoreDifference = maxScore - minScore;

      // Verify all teams have equal number of players
      const isEqualPlayers = tempTeams.every((team) => {
        const teamSize =
          team.defenders.length +
          team.midfielders.length +
          team.forwards.length;
        return teamSize === playersPerTeam;
      });

      if (isEqualPlayers && scoreDifference < minScoreDifference) {
        minScoreDifference = scoreDifference;
        bestAllocation = tempTeams;

        // If we find a perfect allocation (difference ≤ 2), stop searching
        if (scoreDifference <= 2) {
          break;
        }
      }
    }

    return (
      bestAllocation ||
      Array.from({ length: teamsCount }, () => ({
        defenders: [],
        midfielders: [],
        forwards: [],
      }))
    );
  };

  const allocateTeams = (): void => {
    const bestTeams = findBestAllocation(players, numberOfTeams);
    setTeams(bestTeams);
  };

  const TeamCard: React.FC<TeamCardProps> = ({ team, index }) => {
    const teamScore = calculateTeamScore(team);
    const backgroundColor = teamColors[index % teamColors.length];
    const totalPlayers =
      team.defenders.length + team.midfielders.length + team.forwards.length;

    return (
      <Card className={`w-full ${backgroundColor}`}>
        <CardHeader>
          <CardTitle className='text-xl font-bold flex justify-between'>
            <span>Đội {index + 1}</span>
            <span className='text-gray-600'>Điểm: {teamScore}</span>
          </CardTitle>
          <div className='text-sm text-gray-600'>
            Total Players: {totalPlayers}
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold mb-2'>
                Hậu vệ ({team.defenders.length})
              </h3>
              <ul className='list-disc pl-4'>
                {team.defenders.map((player) => (
                  <li key={player.id}>
                    {player.first_name} {player.last_name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-2'>
                Tiền vệ ({team.midfielders.length})
              </h3>
              <ul className='list-disc pl-4'>
                {team.midfielders.map((player) => (
                  <li key={player.id}>
                    {player.first_name} {player.last_name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-2'>
                Tiền đạo ({team.forwards.length})
              </h3>
              <ul className='list-disc pl-4'>
                {team.forwards.map((player) => (
                  <li key={player.id}>
                    {player.first_name} {player.last_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const selectPlayersForCleaning = (
    players: any[],
    numPlayers: number = 4
  ): any[] => {
    // Ensure all players have times_of_cleaning
    const playersWithCleaning = players.map((player) => ({
      ...player,
      times_of_cleaning: player.times_of_cleaning || 0,
    }));

    // Sort by times_of_cleaning and first_name
    return playersWithCleaning
      .sort((a, b) => {
        if (a.times_of_cleaning !== b.times_of_cleaning) {
          return a.times_of_cleaning - b.times_of_cleaning;
        }
        return a.first_name.localeCompare(b.first_name);
      })
      .slice(0, numPlayers);
  };

  const playersForCleaning = selectPlayersForCleaning(players);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Select
          value={numberOfTeams.toString()}
          onValueChange={(value) => setNumberOfTeams(parseInt(value) as 2 | 3)}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Number of teams' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='2'>2 đội</SelectItem>
            <SelectItem value='3'>3 đội</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={allocateTeams}>Chia đội và bê gôn</Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {teams.map((team, index) => (
          <TeamCard key={index} team={team} index={index} />
        ))}
        <Card className={`w-full bg-yellow-100`}>
          <CardHeader>
            <CardTitle className='text-xl font-bold flex justify-between'>
              <span>Đội bê gôn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <ul className='list-disc pl-4'>
                  {playersForCleaning.map((player) => (
                    <li key={player.id}>
                      {player.first_name} {player.last_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
