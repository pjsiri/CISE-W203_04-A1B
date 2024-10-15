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
};

export const DefaultEmptyArticle: Article = {
    _id: undefined,
    title: '',
    authors: '',
    source: '',
    pubYear: 'yyyy',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    seMethod: '',
    summary: '',
    status: 'pending_moderation',
}    