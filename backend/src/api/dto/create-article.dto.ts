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
    submitterName: string;
    submitterEmail: string;
    averageRating: number = 0;
    totalRating: number = 0;
    numberOfRatings: number = 0;
    claim: string = "";
    evidenceResult: string = "";
    researchType: string = "";
    participantType: string = "";
    isAnalysed: boolean = false;
}  