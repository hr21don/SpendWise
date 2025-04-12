"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ExpenseRecord } from "@/services/csv-parser"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"

const expenseSchema = z.object({
  date: z.date(),
  payee: z.string().min(3, {
    message: "Payee must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  amount: z.string().refine((value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Amount must be a positive number.",
  }),
  typeOfExpense: z.string().min(3, {
    message: "Type of Expense must be at least 3 characters.",
  }),
  paymentMethod: z.string().min(3, {
    message: "Payment Method must be at least 3 characters.",
  }),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface AddExpenseDialogProps {
  children: React.ReactNode;
}

export function AddExpenseDialog({ children }: AddExpenseDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [expenses, setExpenses] = useLocalStorage<ExpenseRecord[]>('expenses', []);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date(),
      payee: "",
      description: "",
      amount: "",
      typeOfExpense: "",
      paymentMethod: "",
    },
  })

  function onSubmit(values: ExpenseFormValues) {
    const newExpense: ExpenseRecord = {
      date: format(values.date, 'yyyy-MM-dd'),
      payee: values.payee,
      description: values.description,
      amount: parseFloat(values.amount),
      typeOfExpense: values.typeOfExpense,
      paymentMethod: values.paymentMethod,
    };

    setExpenses([...expenses, newExpense]);
    toast({
      title: "Expense added!",
      description: "Your expense has been added to the list.",
    })
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Manually add a new expense to your list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Starbucks" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the payee.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coffee" {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief description of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 25.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeOfExpense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Expense</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Food" {...field} />
                  </FormControl>
                  <FormDescription>
                    The type of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Credit Card" {...field} />
                  </FormControl>
                  <FormDescription>
                    The method of payment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
