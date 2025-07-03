"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderIcon, Search as SearchIcon } from "lucide-react";
import z from "zod";

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

interface Crime {
  id: string;
  number: string;
  year: number;
  typeOfAccusation: string;
  lastBehaviors: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchResult {
  criminal: Criminal;
  crimes: Crime[];
}

interface SearchProps {
  onSearchResults?: (results: SearchResult[]) => void;
  onLoading?: (loading: boolean) => void;
  onError?: (error: string | null) => void;
}

const Search = ({ onSearchResults, onLoading, onError }: SearchProps) => {
    const [loading, setLoading] = useState(false);

    const formSchema = z.object({
        search: z.string().min(1, "Search is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          search: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.search.trim()) {
            onError?.("Please enter a search term");
            return;
        }

        setLoading(true);
        onLoading?.(true);
        onError?.(null);

        try {
            const params = new URLSearchParams();
            params.append("query", values.search.trim());

            const response = await fetch(`/api/crimes?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to search criminals");
            }

            if (!data.success) {
                throw new Error(data.error || "Search failed");
            }

            // Transform the data to match the expected format
            const transformedResults: SearchResult[] = [];
            
            if (Array.isArray(data.data)) {
                // Group crimes by criminal
                const criminalMap = new Map<string, { criminal: Criminal; crimes: Crime[] }>();
                
                data.data.forEach((record: { crime: Crime; criminal: Criminal }) => {
                    const { crime, criminal } = record;
                    
                    if (!criminalMap.has(criminal.id)) {
                        criminalMap.set(criminal.id, { criminal, crimes: [] });
                    }
                    
                    criminalMap.get(criminal.id)!.crimes.push(crime);
                });
                
                transformedResults.push(...criminalMap.values());
            } else {
                // Single result
                const { crime, criminal } = data.data;
                transformedResults.push({ criminal, crimes: [crime] });
            }

            onSearchResults?.(transformedResults);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            onError?.(errorMessage);
            onSearchResults?.([]);
        } finally {
            setLoading(false);
            onLoading?.(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 grid grid-cols-6 gap-4 items-end px-2">
                
                <div className="sm:col-span-5 col-span-6 mb-0">
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="ابحث بإستخدام الاسم أو الرقم القومي أو إسم الشهرة "
                                            type="text"
                                            className="pl-10"
                                            {...field} 
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button 
                    disabled={form.watch("search") === "" || loading} 
                    type="submit" 
                    className="sm:col-span-1 col-span-6 cursor-pointer"
                >
                    {loading ? <LoaderIcon /> : "ابحث"}
                </Button>
            </form>
        </Form>
    )
}

export default Search