export type ProgramBlock = {
  number: string;
  label: string;
  day: string;
  dayNumber: number;
  schedule: string;
  startClock: string;
  endClock: string;
  startsAt: string;
  endsAt: string;
  title: string;
  pillar: string;
  host: string;
  guests: string;
  focus: string;
  challenge: string;
  channels: string;
  minutes: number;
  segmentCount: number;
};

export type ProgramSegment = {
  id: string;
  day: string;
  block: string;
  duration: number;
  name: string;
  execution: string;
  type: string;
  presenter: string;
  file: string;
  format: string;
  platforms: string;
  status: string;
  notes: string;
  startsAt: string;
  endsAt: string;
  clock: string;
};
