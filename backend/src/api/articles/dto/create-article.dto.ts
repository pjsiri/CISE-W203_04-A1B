export class CreateArticleDto {
    title: string;
    authors: string;
    source: string;
    pubYear: number;
    volume: string;
    number: string;
    pages: string;
    doi: string;
    seMethod: string = "";
    summary: string;
    status: string;
    averageRating: number = 0;
}  