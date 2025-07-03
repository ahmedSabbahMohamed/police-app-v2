import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableHeader,
  } from '@/components/ui/table';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Button } from '@/components/ui/button';
  import { MoreHorizontal } from 'lucide-react';
  
  interface Crime {
    id: string;
    number: string;
    year: number;
    typeOfAccusation: string;
    lastBehaviors: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface CrimesTableProps {
    crimes: Crime[];
    onEdit: (crime: Crime) => void;
    onDelete: (crimeId: string) => void;
  }
  
  const CrimesTable: React.FC<CrimesTableProps> = ({ crimes, onEdit, onDelete }) => {
    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
              <TableHead className="w-1/5 text-white">Number</TableHead>
              <TableHead className="w-1/5 text-white">Year</TableHead>
              <TableHead className="w-1/5 text-white">Type of Accusation</TableHead>
              <TableHead className="w-2/5 text-white">Last Behaviors</TableHead>
              <TableHead className="text-right w-[50px] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crimes.map((crime) => (
              <TableRow key={crime.id} className="odd:bg-muted/40">
                <TableCell>{crime.number}</TableCell>
                <TableCell>{crime.year}</TableCell>
                <TableCell>{crime.typeOfAccusation}</TableCell>
                <TableCell>{crime.lastBehaviors}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(crime)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => onDelete(crime.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default CrimesTable;
  