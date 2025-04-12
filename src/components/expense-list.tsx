"use client"

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ExpenseRecord } from '@/services/csv-parser';

export const ExpenseList = () => {
  const [expenses] = useLocalStorage<ExpenseRecord[]>('expenses', []);

  return (
    <div>
      <h2>Expense List</h2>
      {expenses && expenses.length > 0 ? (
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.date} - {expense.description} - £{expense.amount} - {expense.category}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses added yet.</p>
      )}
    </div>
  );
};
