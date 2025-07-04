"use client"

import {
  toast
} from "sonner"
import {
  useForm,
  useFieldArray
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  format
} from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Calendar
} from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2
} from "lucide-react"
import {
  Textarea
} from "@/components/ui/textarea"

const criminalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationalId: z.string().length(14, "National ID must be 14 digits"),
  job: z.string().min(2, "Job is required"),
  bod: z.coerce.date().optional(),
  motherName: z.string().min(2, "Mother's name is required"),
  stageName: z.string().min(2, "Stage name is required"),
  impersonation: z.string().min(2, "Impersonation details are required"),
  address: z.string().optional()
});

const formSchema = z.object({
  crime: z.object({
    number: z.string().min(1, "Number is required"),
    typeOfAccusation: z.string().min(1, "Type of accusation is required"),
    year: z.coerce.number().gte(1900, "Invalid year"),
    lastBehaviors: z.string().min(1, "Last behaviors are required")
  }),
  criminals: z.array(criminalSchema).min(1, "At least one criminal is required")
});

export default function CrimeForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crime: {
        number: "",
        typeOfAccusation: "",
        year: undefined,
        lastBehaviors: ""
      },
      criminals: [{
        name: "",
        nationalId: "",
        job: "",
        bod: undefined,
        motherName: "",
        stageName: "",
        impersonation: "",
        address: ""
      }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "criminals"
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Submitting form data:", values);
      
      // Transform the data to match API expectations
      const transformedData = {
        crime: {
          number: values.crime.number,
          typeOfAccusation: values.crime.typeOfAccusation,
          year: values.crime.year,
          lastBehaviors: values.crime.lastBehaviors
        },
        criminals: values.criminals.map(criminal => ({
          name: criminal.name,
          nationalId: criminal.nationalId,
          job: criminal.job,
          bod: criminal.bod ? criminal.bod.toISOString().split('T')[0] : undefined,
          motherName: criminal.motherName,
          stageName: criminal.stageName,
          impersonation: criminal.impersonation,
          address: criminal.address
        }))
      };
      
      const response = await fetch('/api/crimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Crime report submitted successfully!");
        console.log("Success:", result);
        // Optionally reset the form
        form.reset();
      } else {
        toast.error(result.error || "Failed to submit crime report");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form dir="rtl" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

        <div className="border rounded-xl p-6 my-5 bg-white shadow-md space-y-4">
            <h2 className="text-2xl font-bold mb-4">تقرير الجريمة</h2>
            <p className="text-gray-600 mb-6">يرجى ملء النموذج أدناه للإبلاغ عن جريمة.</p>

            <FormField
            control={form.control}
            name="crime.number"
            render={({ field }) => (
                <FormItem>
                <FormLabel>رقم القضية</FormLabel>
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
                <FormLabel>نوع الاتهام </FormLabel>
                <FormControl>
                    <Input 
                    placeholder="سرقة"
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
                <FormLabel>سنة القضية </FormLabel>
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
                <FormLabel>التصرفات النهائية </FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="التصرفات النهائية التي قام بها الجاني قبل ارتكاب الجريمة"
                    className="resize-none"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="border rounded-xl p-6 my-5 bg-white shadow-md space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">المجرمون الذين ارتكبوا الجريمة</h2>
            </div>
            <p className="text-gray-600 mb-6">يرجى ملء النموذج أدناه للإبلاغ عن المجرمين.</p>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">المجرم {index + 1}</h3>
                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full w-8 h-8 p-0 cursor-pointer border-red-400 text-red-400"
                                onClick={() => remove(index)}
                            >
                                <Trash2 />
                            </Button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الأسم </FormLabel>
                                    <FormControl>
                                        <Input placeholder="محمد محمد أحمد" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.nationalId`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الرقم القومي (14)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12345678901234" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.job`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الوظيفة </FormLabel>
                                    <FormControl>
                                        <Input placeholder="ميكانيكي" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.motherName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>إسم الام</FormLabel>
                                    <FormControl>
                                        <Input placeholder="فاطمة محمد" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.stageName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>إسم الشهرة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="الشبح" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.impersonation`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>إنتحال الشخصية</FormLabel>
                                    <FormControl>
                                        <Input placeholder="متنكر في هيئة رجل أمن" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.address`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>العنوان</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 شارع الرئيسي، القاهرة" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name={`criminals.${index}.bod`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>تاريخ الميلاد</FormLabel>
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
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>اختر تاريخًا</span>
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
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Add Criminal"
              onClick={() => append({
                  name: "",
                  nationalId: "",
                  job: "",
                  bod: undefined,
                  motherName: "",
                  stageName: "",
                  impersonation: "",
                  address: ""
              })}
            >
              <Plus />
            </Button>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}