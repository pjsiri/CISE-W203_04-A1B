export type Article = {
    _id?: string;
    title?: string;
    authors?: string;
    source?: string;
    pubYear?: string;
    volume?: string;
    number?: string;
    pages?: string;
    doi?: string;
    seMethod?: string;
    summary?: string;
    status?: string;
    submitterName?: string;
    submitterEmail?: string;
    claim?: string;
    evidenceResult?: string;
    researchType?: string;
    participantType?: string;
    isAnalysed?: boolean;
};

export const DefaultEmptyArticle: Article = {
    _id: undefined,
    title: '',
    authors: '',
    source: '',
    pubYear: '',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    seMethod: '',
    summary: '',
    status: 'pending_moderation',
    submitterName: '',
    submitterEmail: '',
    claim: '',
    evidenceResult: '',
    researchType: '',
    participantType: '',
    isAnalysed: false,
}    