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
  code: string;
  day: string;
  block: string;
  duration: number;
  name: string;
  execution: string;
  live: boolean;
  type: string;
  presenter: string;
  file: string;
  format: string;
  platforms: string;
  status: string;
  notes: string;
  done: boolean;
  startsAt: string;
  endsAt: string;
  clock: string;
  startClock: string;
  endClock: string;
};

export type PublicProgramSegment = Pick<
  ProgramSegment,
  | "id"
  | "code"
  | "block"
  | "name"
  | "startClock"
  | "endClock"
  | "startsAt"
  | "endsAt"
  | "duration"
  | "live"
  | "type"
  | "presenter"
  | "status"
  | "notes"
>;

export type ProgramState = {
  blocks: ProgramBlock[];
  segments: ProgramSegment[];
  updatedAt: string;
  updatedBy: string;
};
