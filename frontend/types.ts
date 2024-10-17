export interface Article {
    id: string;
    title: string;
    authors: string[];
    journal: string;
    year?: number;
    seMethod: string;
    claim: string;
    evidence: string;
  }