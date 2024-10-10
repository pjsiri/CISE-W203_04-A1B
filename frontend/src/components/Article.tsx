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
    summary: '',
    status: 'pending_moderation',
}    