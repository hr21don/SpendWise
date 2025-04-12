'use server';
/**
 * Represents a single expense record parsed from a CSV file.
 */
export interface ExpenseRecord {
  /**
   * The date of the expense, in a string format (e.g., 'YYYY-MM-DD').
   */
  date: string;
  /**
   * A description of the expense.
   */
  description: string;
  /**
   * The amount of the expense.
   */
  amount: number;
  /**
   * The type of expense.
   */
  typeOfExpense: string;
  /**
   * The method of payment.
   */
  paymentMethod: string;
  /**
   * The payee.
   */
  payee: string;
}

/**
 * Asynchronously parses a CSV file and extracts expense records.
 *
 * @param csvFile The CSV file to parse.
 * @returns A promise that resolves to an array of ExpenseRecord objects.
 */
export async function parseCsv(csvFile: File): Promise<ExpenseRecord[]> {
  const fileContents = await csvFile.text();
  const lines = fileContents
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '');

  const headers = lines[0].split(',').map((header) => header.trim());
  const records: ExpenseRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((value) => value.trim());
    if (values.length === headers.length) {
      const record: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = values[j];
      }

      const expenseRecord: ExpenseRecord = {
        date: record['Date on Receipt'] || '',
        description: record['Description of Expense'] || '',
        amount: parseFloat(record['Currency']) || 0, // Assuming "Currency" column holds the amount
        typeOfExpense: record['Type of Expense'] || '',
        paymentMethod: record['Payment Method'] || '',
        payee: record['Payee'] || '',
      };

      records.push(expenseRecord);
    }
  }

  return records;
}