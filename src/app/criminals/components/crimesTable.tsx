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
  import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
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
  
  interface FormValues {
    crime: {
      number: string;
      year: number;
      typeOfAccusation: string;
      lastBehaviors: string;
    };
  }

  interface CrimesTableProps {
    crimes: Crime[];
    criminal: Criminal; // Add criminal prop to get nationalId
    onEdit: (crime: Crime) => void;
    onDelete: (crimeId: string) => void;
    onAdd: (crime: Crime) => void; // Add callback for new crimes
  }
  
  const CrimesTable: React.FC<CrimesTableProps> = ({ crimes, criminal, onEdit, onDelete, onAdd }) => {
    const [editingCrime, setEditingCrime] = useState<Crime | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingCrime, setDeletingCrime] = useState<Crime | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleEditClick = (crime: Crime) => {
      setEditingCrime(crime);
      setIsDialogOpen(true);
    };

    const handleDeleteClick = (crime: Crime) => {
      setDeletingCrime(crime);
      setIsDeleteDialogOpen(true);
    };

    const handleAddClick = () => {
      setIsAddDialogOpen(true);
    };

    const handleFormSubmit = async (values: FormValues) => {
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

    const handleAddFormSubmit = async (values: FormValues) => {
      setIsAdding(true);
      
      try {
        const response = await fetch(`/api/criminal?nationalId=${criminal.nationalId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values.crime),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add crime');
        }

        if (data.success) {
          // Create a new crime object with generated ID
          const newCrime: Crime = {
            id: `temp-${Date.now()}`, // Temporary ID, will be updated when data is refreshed
            ...values.crime,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          onAdd(newCrime);
          setIsAddDialogOpen(false);
        } else {
          throw new Error(data.error || 'Add failed');
        }
      } catch (error) {
        console.error('Error adding crime:', error);
        alert(error instanceof Error ? error.message : 'Failed to add crime');
      } finally {
        setIsAdding(false);
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
      <div className="space-y-4">
        {/* Add Crime Button */}
        <div className="flex justify-between items-center">
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة قضية جديدة
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">
            ({crimes.length} قضية)
          </h2>
        </div>

        {/* Crimes Table */}
        <div className="border-2 border-gray-300 rounded-md overflow-hidden">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
                <TableHead className="w-1/5 text-white text-center border border-gray-300">م</TableHead>
                <TableHead className="w-1/5 text-white text-center border border-gray-300">رقم القضية</TableHead>
                <TableHead className="w-1/5 text-white text-center border border-gray-300">سنة القضية </TableHead>
                <TableHead className="w-1/5 text-white text-center border border-gray-300">نوع الاتهام</TableHead>
                <TableHead className="w-2/5 text-white text-center border border-gray-300">التصرفات النهائية</TableHead>
                <TableHead className="text-center w-[50px] text-white border border-gray-300">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crimes.map((crime, index) => (
                <TableRow key={crime.id} className="odd:bg-muted/40">
                  <TableCell className='text-center border border-gray-300'>{index + 1}</TableCell>
                  <TableCell className='text-center border border-gray-300'>{crime.number}</TableCell>
                  <TableCell className='text-center border border-gray-300'>{crime.year}</TableCell>
                  <TableCell className='text-center border border-gray-300'>{crime.typeOfAccusation}</TableCell>
                  <TableCell className='text-center border border-gray-300'>{crime.lastBehaviors}</TableCell>
                  <TableCell className="text-center border border-gray-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(crime)}>
                          <Edit className="h-4 w-4 mr-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-500" 
                          onClick={() => handleDeleteClick(crime)}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <h2 className="block text-end mt-4 text-2xl font-semibold text-gray-900">
                  تعديل القضية
                </h2>
            </DialogHeader>
            <CrimeForm 
              initialData={editingCrime}
              onSubmit={handleFormSubmit}
              isSubmitting={isUpdating}
            />
          </DialogContent>
        </Dialog>

        {/* Add Crime Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <h2 className="block text-end mt-4 text-2xl font-semibold text-gray-900">
                إضافة قضية جديدة
              </h2>
            </DialogHeader>
            <CrimeForm 
              onSubmit={handleAddFormSubmit}
              isSubmitting={isAdding}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <h2 className="block text-end mt-4 text-2xl font-semibold text-gray-900">
                هل أنت متأكد؟
              </h2>
              <h3 className='text-end'>
                <span className="text-red-600 font-semibold">تحذير:</span> حذف الجريمة سيؤدي إلى فقدان جميع البيانات المرتبطة بها.
              </h3>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "حذف..." : "حذف"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };
  
  export default CrimesTable;
  