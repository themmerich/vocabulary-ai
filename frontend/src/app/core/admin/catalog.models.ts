/** Types mirroring the backend catalog DTOs (`/api/admin`). */

export type Lehrwerk = {
  readonly id: string;
  readonly title: string;
  readonly language: string;
  readonly lektionCount: number;
};

export type Lektion = {
  readonly id: string;
  readonly lehrwerkId: string;
  readonly title: string;
  readonly orderIndex: number;
};

export type Vokabel = {
  readonly id: string;
  readonly foreignTerm: string;
  readonly meanings: string[];
  readonly orderIndex: number;
};

export type Grammatikregel = {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly orderIndex: number;
};

export type LektionDetail = {
  readonly id: string;
  readonly lehrwerkId: string;
  readonly title: string;
  readonly orderIndex: number;
  readonly vokabeln: Vokabel[];
  readonly grammatikregeln: Grammatikregel[];
};

export type ImportResult = {
  readonly imported: number;
  readonly skipped: number;
};

export type LehrwerkInput = {
  title: string;
  language: string;
};

export type LektionInput = {
  title: string;
};

export type VokabelInput = {
  foreignTerm: string;
  meanings: string[];
};

export type GrammatikregelInput = {
  title: string;
  content: string;
};
