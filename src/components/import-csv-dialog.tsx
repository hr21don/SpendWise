"use client"

import * as React from "react"

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
import { parseCsv, ExpenseRecord } from "@/services/csv-parser"
import { toast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface ImportCsvDialogProps {
  children: React.ReactNode;
}

export function ImportCsvDialog({ children }: ImportCsvDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [expenses, setExpenses] = useLocalStorage<ExpenseRecord[]>('expenses', []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast({
        title: "No file selected.",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newExpenses = await parseCsv(csvFile);
      setExpenses([...expenses, ...newExpenses]);
      toast({
        title: "CSV imported successfully!",
        description: `${newExpenses.length} expenses have been added to your list.`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error importing CSV.",
        description: "There was an error parsing the CSV file. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Import expenses from a CSV file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csv" className="text-right">
              CSV File
            </Label>
            <Input id="csv" type="file" className="col-span-3" onChange={handleFileChange} accept=".csv" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

