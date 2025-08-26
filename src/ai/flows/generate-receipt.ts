'use server';

/**
 * @fileOverview Generates customized, print-ready receipts from transaction data and branding preferences.
 *
 * - generateReceipt - A function that handles the receipt generation process.
 * - GenerateReceiptInput - The input type for the generateReceipt function.
 * - GenerateReceiptOutput - The return type for the generateReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReceiptInputSchema = z.object({
  transactionData: z.string().describe('JSON string containing the transaction details including items purchased, prices, and date.'),
  brandingPreferences: z.string().describe('JSON string containing branding preferences such as logo URL, brand colors, and font.'),
  customerContact: z.string().describe('Customer contact information (email or phone number) for sending the receipt.'),
  receiptFormat: z.enum(['print', 'email', 'sms']).describe('The desired format for the receipt (print, email, or SMS).'),
});
export type GenerateReceiptInput = z.infer<typeof GenerateReceiptInputSchema>;

const GenerateReceiptOutputSchema = z.object({
  receiptContent: z.string().describe('The generated receipt content in the specified format (e.g., HTML for email, plain text for SMS, or a printable format).'),
  contentType: z.string().describe('The content type of the receipt, such as text/html or text/plain.'),
});
export type GenerateReceiptOutput = z.infer<typeof GenerateReceiptOutputSchema>;

export async function generateReceipt(input: GenerateReceiptInput): Promise<GenerateReceiptOutput> {
  return generateReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReceiptPrompt',
  input: {schema: GenerateReceiptInputSchema},
  output: {schema: GenerateReceiptOutputSchema},
  prompt: `You are an AI assistant designed to generate receipts based on transaction data and branding preferences.

  Instructions:
  1.  Carefully parse the provided transaction data and branding preferences, which are provided as JSON strings.
  2.  Customize the receipt based on the branding preferences, including logo, colors, and fonts.
  3.  Generate the receipt in the format specified by the receiptFormat parameter.
  4.  If the receipt format is "email", generate an HTML receipt.
  5.  If the receipt format is "sms", generate a plain text receipt.
  6.  If the receipt format is "print", generate a format suitable for printing.
  7.  Ensure that the receipt includes all necessary information, such as the date, time, items purchased, prices, and total amount.

  Transaction Data:
  {{transactionData}}

  Branding Preferences:
  {{brandingPreferences}}

  Receipt Format:
  {{receiptFormat}}

  Customer Contact:
  {{customerContact}}

  Output the receipt content and its content type.
  contentType: text/html or text/plain or appropriate print format
  receiptContent: <The Generated Receipt Content>
  `,
});

const generateReceiptFlow = ai.defineFlow(
  {
    name: 'generateReceiptFlow',
    inputSchema: GenerateReceiptInputSchema,
    outputSchema: GenerateReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
