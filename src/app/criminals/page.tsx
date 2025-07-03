"use client"

import { useState } from "react";

export const dynamic = 'force-dynamic';
import { Search } from "./components"
import CrimesTable from "./components/crimesTable"
import CriminalDetails from "./components/criminalDetails"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

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

const Page = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const handleEditCrime = (crime: Crime) => {
    console.log("Edit crime:", crime);
    // Update the crime in the search results
    setSearchResults(prevResults => 
      prevResults.map(result => ({
        ...result,
        crimes: result.crimes.map(c => 
          c.id === crime.id ? crime : c
        )
      }))
    );
  };

  const handleDeleteCrime = (crimeId: string) => {
    console.log("Delete crime:", crimeId);
    // Remove the crime from the search results
    setSearchResults(prevResults => 
      prevResults.map(result => ({
        ...result,
        crimes: result.crimes.filter(c => c.id !== crimeId)
      }))
    );
  };

  const handleAddCrime = (crime: Crime) => {
    console.log("Add crime:", crime);
    // Add the new crime to the search results
    setSearchResults(prevResults => 
      prevResults.map(result => ({
        ...result,
        crimes: [...result.crimes, crime]
      }))
    );
  };

  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto p-6">
      <Search 
        onSearchResults={handleSearchResults}
        onLoading={handleLoading}
        onError={handleError}
      />

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">جاري البحث عن المجرمين...</p>
        </div>
      )}

      {/* No Results State */}
      {hasSearched && !loading && !error && searchResults.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-500">لم يتم العثور على مجرمين يتطابقون مع معايير البحث الخاصة بك.</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && searchResults.length > 0 && (
        <div className="space-y-8 mt-8">
          {searchResults.map((result, index) => (
            <div key={result.criminal.id} className="space-y-6">
              {/* Criminal Details */}
              <CriminalDetails criminal={result.criminal} />
              
              {/* Crimes Table */}
              <div className="mt-10">
                <CrimesTable
                  crimes={result.crimes}
                  criminal={result.criminal}
                  onEdit={handleEditCrime}
                  onDelete={handleDeleteCrime}
                  onAdd={handleAddCrime}
                />
              </div>

              {/* Separator between multiple results */}
              {index < searchResults.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Default State - Show when no search has been performed */}
      {!hasSearched && !loading && !error && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ابحث عن سجلات المجرمين</h3>
          <p className="text-gray-500">أدخل اسمًا أو اسم شهرة أو رقمًا قوميًّا للبحث عن سجلات المجرمين.</p>
        </div>
      )}
    </div>
  )
}

export default Page