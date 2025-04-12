import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Dashboard } from './dashboard';
import { Icons } from '@/components/icons';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { ImportCsvDialog } from '@/components/import-csv-dialog';

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2>SpendWise</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={true}>
                <Icons.home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <AddExpenseDialog>
                <SidebarMenuButton>
                  <Icons.plusCircle />
                  <span>Add Expense</span>
                </SidebarMenuButton>
              </AddExpenseDialog>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ImportCsvDialog>
                <SidebarMenuButton>
                  <Icons.workflow />
                  <span>Import CSV</span>
                </SidebarMenuButton>
              </ImportCsvDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <p>Copyright &copy; {currentYear} SpendWise </p>
        </SidebarFooter>
      </Sidebar>
      <Dashboard/>
      <Toaster />
    </SidebarProvider>
  );
}
