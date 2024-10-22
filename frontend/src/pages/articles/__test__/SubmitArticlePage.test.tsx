import { testSubmitArticle } from "../CreateArticle";
import { Article } from "@/components/Article";

describe("testSubmitArticle function", () => {
  test("should return success for valid article submission", () => {
    const validArticle: Article = {
      submitterName: "John Doe",
      submitterEmail: "john@example.com",
      title: "Test Article",
      authors: "Author A",
      source: "Test Journal",
      pubYear: "2023",
      volume: "1",
      number: "1",
      pages: "1-10",
      doi: "10.1234/test.doi",
    };

    const result = testSubmitArticle(validArticle);
    expect(result).toEqual({ success: true, message: "Article submitted successfully!" });
  });

  test("should return error if submitter information is missing", () => {
    const invalidArticle: Article = {
      submitterName: "",
      submitterEmail: "",
      title: "Test Article",
      authors: "Author A",
      source: "Test Journal",
      pubYear: "2023",
      volume: "1",
      number: "1",
      pages: "1-10",
      doi: "10.1234/test.doi",
    };

    const result = testSubmitArticle(invalidArticle);
    expect(result).toEqual({ success: false, message: "Submitter information is required." });
  });

  test("should return error if any article fields are missing", () => {
    const incompleteArticle: Article = {
      submitterName: "John Doe",
      submitterEmail: "john@example.com",
      title: "",
      authors: "Author A",
      source: "Test Journal",
      pubYear: "2023",
      volume: "1",
      number: "1",
      pages: "1-10",
      doi: "10.1234/test.doi",
    };

    const result = testSubmitArticle(incompleteArticle);
    expect(result).toEqual({ success: false, message: "All article fields are required." });
  });
});
