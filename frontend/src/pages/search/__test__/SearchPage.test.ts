import { testSearchPage } from '../index';

describe('SearchPage Validation', () => {
  test('valid search parameters', () => {
    const result = testSearchPage("Method A", "2020", "2022");
    expect(result).toEqual({ success: true, message: "Search parameters are valid." });
  });

  test('missing SE method', () => {
    const result = testSearchPage("", "2020", "2022");
    expect(result).toEqual({ success: false, message: "SE Method is required." });
  });

  test('invalid start year', () => {
    const result = testSearchPage("Method A", "1899", "2022");
    expect(result).toEqual({ success: false, message: "Start year must be a valid year between 1900 and the current year." });
  });

  test('invalid end year', () => {
    const result = testSearchPage("Method A", "2020", "2025");
    expect(result).toEqual({ success: false, message: "End year must be a valid year between 1900 and the current year." });
  });

  test('non-numeric start year', () => {
    const result = testSearchPage("Method A", "twenty", "2022");
    expect(result).toEqual({ success: false, message: "Start year must be a valid year between 1900 and the current year." });
  });

  test('non-numeric end year', () => {
    const result = testSearchPage("Method A", "2020", "twenty-two");
    expect(result).toEqual({ success: false, message: "End year must be a valid year between 1900 and the current year." });
  });
});
