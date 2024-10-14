export class CreateArticleDto {
    title: string;
    authors: string;
    source: string;
    pubYear: number;
    volume: string;
    number: string;
    pages: string;
    doi: string;
    summary: string;
    status: string;
    seMethod: string = "";
    averageRating: number = 0;
}  