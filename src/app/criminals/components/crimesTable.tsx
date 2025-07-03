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
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { Button } from '@/components/ui/button';
  import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
  import { useState } from 'react';
  import CrimeForm from './crimeForm';
  
  interface Crime {
    id: string;
    number: string;
    year: number;
    typeOfAccusation: string;
    lastBehaviors: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Criminal {
    id: string;
    name: string;
    nationalId: string;
    job: string;
    bod: string | null;
    motherName: string;
    stageName: string;
    impersonation: string;
    address: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  interface CrimesTableProps {
    crimes: Crime[];
    criminal: Criminal; // Add criminal prop to get nationalId
    onEdit: (crime: Crime) => void;
    onDelete: (crimeId: string) => void;
  }
  
  const CrimesTable: React.FC<CrimesTableProps> = ({ crimes, criminal, onEdit, onDelete }) => {
    const [editingCrime, setEditingCrime] = useState<Crime | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingCrime, setDeletingCrime] = useState<Crime | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditClick = (crime: Crime) => {
      setEditingCrime(crime);
      setIsDialogOpen(true);
    };

    const handleDeleteClick = (crime: Crime) => {
      setDeletingCrime(crime);
      setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (values: any) => {
      if (!editingCrime) return;

      setIsUpdating(true);
      
      try {
        const response = await fetch(`/api/crimes?id=${editingCrime.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values.crime),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update crime');
        }

        if (data.success) {
          // Update the crime in the local state
          const updatedCrime = { ...editingCrime, ...values.crime };
          onEdit(updatedCrime);
          setIsDialogOpen(false);
          setEditingCrime(null);
        } else {
          throw new Error(data.error || 'Update failed');
        }
      } catch (error) {
        console.error('Error updating crime:', error);
        alert(error instanceof Error ? error.message : 'Failed to update crime');
      } finally {
        setIsUpdating(false);
      }
    };

    const handleDeleteConfirm = async () => {
      if (!deletingCrime) return;

      setIsDeleting(true);
      
      try {
        const response = await fetch(`/api/crimes?nationalId=${criminal.nationalId}&crimeId=${deletingCrime.id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete crime');
        }

        if (data.success) {
          // Remove the crime from local state
          onDelete(deletingCrime.id);
          setIsDeleteDialogOpen(false);
          setDeletingCrime(null);
        } else {
          throw new Error(data.error || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting crime:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete crime');
      } finally {
        setIsDeleting(false);
      }
    };

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
                      <DropdownMenuItem onClick={() => handleEditClick(crime)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500" 
                        onClick={() => handleDeleteClick(crime)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Crime</DialogTitle>
            </DialogHeader>
            <CrimeForm 
              initialData={editingCrime}
              onSubmit={handleFormSubmit}
              isSubmitting={isUpdating}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the crime "{deletingCrime?.number}" from {criminal.name}'s record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };
  
  export default CrimesTable;
  