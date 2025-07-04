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
          // Use the real crime data returned from the API
          const newCrime: Crime = data.data.crime;
          
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

          {
            crimes.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <Button onClick={handleAddClick} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة قضية جديدة
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    ({crimes.length} قضية)
                  </h2>
                </div>
              </>
            )
          }

        {/* Crimes Table */}
        {crimes.length > 0 ? (
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
        ) : (
          <div className="border-2 border-gray-300 rounded-md p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قضايا مسجلة</h3>
            <p className="text-gray-500 mb-4">هذا المجرم لا يملك أي قضايا مسجلة في النظام.</p>
            <Button onClick={handleAddClick} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              إضافة قضية جديدة
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-start mt-6">
                تعديل القضية
              </DialogTitle>
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
              <DialogTitle className="text-start mt-6">
                إضافة قضية جديدة
              </DialogTitle>
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
              <AlertDialogTitle className="text-start mt-6">
                هل أنت متأكد؟
              </AlertDialogTitle>
              <AlertDialogDescription className='text-start'>
                <span className="text-red-600 font-semibold">تحذير:</span> حذف الجريمة سيؤدي إلى فقدان جميع البيانات المرتبطة بها.
              </AlertDialogDescription>
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
  