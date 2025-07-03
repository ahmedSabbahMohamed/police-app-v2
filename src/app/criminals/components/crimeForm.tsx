import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import z from "zod"

interface Crime {
  id: string;
  number: string;
  year: number;
  typeOfAccusation: string;
  lastBehaviors: string;
  createdAt: string;
  updatedAt: string;
}

interface CrimeFormProps {
  initialData?: Crime | null;
  onSubmit?: (values: { crime: Omit<Crime, 'id' | 'createdAt' | 'updatedAt'> }) => void;
  isSubmitting?: boolean;
}

const CrimeForm: React.FC<CrimeFormProps> = ({ initialData, onSubmit, isSubmitting = false }) => {

    const formSchema = z.object({
        crime: z.object({
            number: z.string().min(1, "Number is required"),
            typeOfAccusation: z.string().min(1, "Type of accusation is required"),
            year: z.coerce.number().gte(1900, "Invalid year"),
            lastBehaviors: z.string().min(1, "Last behaviors are required")
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            crime: {
                number: "",
                typeOfAccusation: "",
                year: 0,
                lastBehaviors: ""
            }
        }
    })

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset({
                crime: {
                    number: initialData.number,
                    typeOfAccusation: initialData.typeOfAccusation,
                    year: initialData.year,
                    lastBehaviors: initialData.lastBehaviors
                }
            });
        }
    }, [initialData, form]);

    function handleSubmit(values: z.infer<typeof formSchema>) {
        if (onSubmit) {
            onSubmit(values);
        } else {
            console.log(values);
        }
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="crime.number"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Crime Number</FormLabel>
                    <FormControl>
                        <Input 
                        placeholder="CR-2024-001"
                        type="text"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="crime.typeOfAccusation"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Type of accusation</FormLabel>
                    <FormControl>
                        <Input 
                        placeholder="Robbery"
                        type="text"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="crime.year"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                        <Input 
                        placeholder="2024"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="crime.lastBehaviors"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last behaviors</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Last behaviors"
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button 
                    type="submit" 
                    className="flex-1 w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Crime"
                    )}
                </Button>
        </form>
    </Form>
  )
}

export default CrimeForm