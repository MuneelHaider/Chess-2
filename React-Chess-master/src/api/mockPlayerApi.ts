import { TeamType } from "../Types";

export interface PlayerProfile {
  team: TeamType;
  name: string;
  elo: number;
  region: string;
  countryFlag: string;
  avatarUrl: string;
  initials: string;
}

const mockPlayerProfiles: PlayerProfile[] = [
  {
    team: TeamType.OUR,
    name: "Martin",
    elo: 2500,
    region: "Bulgaria",
    countryFlag: "🇧🇬",
    avatarUrl: "",
    initials: "M",
  },
  {
    team: TeamType.OPPONENT,
    name: "GothamChess",
    elo: 2778,
    region: "United States",
    countryFlag: "🇺🇸",
    avatarUrl: "",
    initials: "G",
  },
];

export function fetchPlayerProfiles(): Promise<PlayerProfile[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(mockPlayerProfiles), 300);
  });
}
