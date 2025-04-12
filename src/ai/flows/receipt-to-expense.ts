// The receiptToExpense flow extracts expense information from a receipt image and returns it as structured data.
// It takes a receipt image URL as input and returns the date, amount, vendor, and category.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ReceiptToExpenseInputSchema = z.object({
  receiptImageUrl: z.string().describe('The URL of the receipt image.'),
});
export type ReceiptToExpenseInput = z.infer<typeof ReceiptToExpenseInputSchema>;

const ReceiptToExpenseOutputSchema = z.object({
  date: z.string().describe('The date of the expense on the receipt (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount of the expense on the receipt.'),
  vendor: z.string().describe('The name of the vendor on the receipt.'),
  category: z.string().describe('The category of the expense (e.g., Food, Transportation, Groceries).'),
});
export type ReceiptToExpenseOutput = z.infer<typeof ReceiptToExpenseOutputSchema>;

export async function receiptToExpense(input: ReceiptToExpenseInput): Promise<ReceiptToExpenseOutput> {
  return receiptToExpenseFlow(input);
}

const receiptToExpensePrompt = ai.definePrompt({
  name: 'receiptToExpensePrompt',
  input: {
    schema: z.object({
      receiptImageUrl: z.string().describe('The URL of the receipt image.'),
    }),
  },
  output: {
    schema: z.object({
      date: z.string().describe('The date of the expense on the receipt (YYYY-MM-DD).'),
      amount: z.number().describe('The total amount of the expense on the receipt.'),
      vendor: z.string().describe('The name of the vendor on the receipt.'),
      category: z.string().describe('The category of the expense (e.g., Food, Transportation, Groceries).'),
    }),
  },
  prompt: `You are an expert expense tracker. Extract the expense information from the receipt image. 

   Return the data in JSON format. Return a valid date in YYYY-MM-DD format.

    Receipt Image: {{media url=receiptImageUrl}}
  `,
});

const receiptToExpenseFlow = ai.defineFlow<
  typeof ReceiptToExpenseInputSchema,
  typeof ReceiptToExpenseOutputSchema
>({
  name: 'receiptToExpenseFlow',
  inputSchema: ReceiptToExpenseInputSchema,
  outputSchema: ReceiptToExpenseOutputSchema,
}, async (input) => {
  const {output} = await receiptToExpensePrompt(input);
  return output!;
});
