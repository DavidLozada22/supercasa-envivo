export type OnAirFields = {
  title?: string;
  subtitle?: string;
  note?: string;
  guest?: string;
  guestRole?: string;
  returnAt?: string;
};

export type OnAirState = {
  sceneId: string;
  fields: OnAirFields;
  token: string;
  updatedAt: string;
};
