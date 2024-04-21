interface Player {
  name: string;
  position: string;
}

interface Team {
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
}

export function splitPlayersIntoTeams(players: Player[]): Team[] {
  let numberOfTeams = 3;
  if (players.length <= 16) {
    numberOfTeams = 2;
  }
  // Define the number of defenders, midfielders, and forwards per team
  const defendersCount = 3;
  const midfieldersCount = defendersCount;
  const forwardsCount = 1;

  // Shuffle the players array randomly
  players.sort(() => Math.random() - 0.5);

  // Initialize an array to hold the teams
  const teams: Team[] = [];
  for (let i = 0; i < numberOfTeams; i++) {
    teams.push({
      defenders: [],
      midfielders: [],
      forwards: [],
    });
  }

  // Distribute players into teams based on position
  let currentIndex = 0;
  for (let i = 0; i < defendersCount; i++) {
    for (let j = 0; j < numberOfTeams; j++) {
      const player = players[currentIndex];
      if (player.position === 'defender') {
        teams[j].defenders.push(player);
        currentIndex++;
      }
    }
  }
  for (let i = 0; i < midfieldersCount; i++) {
    for (let j = 0; j < numberOfTeams; j++) {
      const player = players[currentIndex];
      if (player.position === 'midfielder') {
        teams[j].midfielders.push(player);
        currentIndex++;
      }
    }
  }
  for (let i = 0; i < forwardsCount; i++) {
    for (let j = 0; j < numberOfTeams; j++) {
      const player = players[currentIndex];
      if (player.position === 'forward') {
        teams[j].forwards.push(player);
        currentIndex++;
      }
    }
  }

  return teams;
}
