"use client"

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ExpenseRecord } from '@/services/csv-parser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, isValid } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard = () => {
  const [expenses, setExpenses] = useLocalStorage<ExpenseRecord[]>('expenses', []);
  const [open, setOpen] = React.useState(false);

  // Calculate total expenses
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Calculate top spending categories
  const categorySpending: { [typeOfExpense: string]: number } = {};
  expenses?.forEach(expense => {
    categorySpending[expense.typeOfExpense] = (categorySpending[expense.typeOfExpense] || 0) + expense.amount;
  });

  const categoryData = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a) // Sort by spending in descending order
    .slice(0, 5) // Take the top 5 categories
    .map(([typeOfExpense, amount]) => ({ name: typeOfExpense, value: amount }));

  const chartConfig = {
    pieChart: {
      label: 'Spending by Category',
    },
  };

  const clearExpenses = () => {
    localStorage.removeItem('expenses');
    setExpenses([]);
    setOpen(false);
  };


  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            £{totalExpenses.toFixed(2)}
          </CardContent>
        </Card>

        {/* Number of Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Number of Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses?.length}
          </CardContent>
        </Card>

        {/* Top Spending Category */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData[0].name} - £{categoryData[0].value.toFixed(2)}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Spending by Category Chart */}
      {categoryData.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <PieChart width={400} height={300}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {
                      categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                  <ChartTooltip>
                    <ChartTooltipContent/>
                  </ChartTooltip>
                  <ChartLegend>
                    <ChartLegendContent/>
                  </ChartLegend>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All Expenses</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your expenses from local storage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearExpenses}>Clear</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {expenses && expenses.length > 0 ? (
                    <div className="overflow-x-auto mt-8">
                        <table className="min-w-full border divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date on Receipt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type of Expense</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expenses.map((expense, index) => {
                                  const date = new Date(expense.date);
                                  const isValidDate = isValid(date);

                                  return (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap">{expense.payee}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {isValidDate ? format(date, 'yyyy-MM-dd') : 'Invalid Date'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">£</td>
                                      <td className="px-6 py-4 whitespace-nowrap">{expense.typeOfExpense}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">{expense.paymentMethod}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">£{expense.amount.toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4">No expenses added yet.</p>
               )}

    </main>
  );
};

