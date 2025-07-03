import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Criminal = {
  name: string;
  nationalId: string;
  job: string;
  bod?: string | null;
  motherName: string;
  stageName: string;
  impersonation: string;
  address?: string | null;
};

interface CriminalDetailsProps {
  criminal: Criminal;
}

const fields: { key: keyof Criminal; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'nationalId', label: 'National ID' },
  { key: 'job', label: 'Job' },
  { key: 'bod', label: 'Birth Date' },
  { key: 'motherName', label: 'Mother\'s Name' },
  { key: 'stageName', label: 'Stage Name' },
  { key: 'impersonation', label: 'Impersonation' },
  { key: 'address', label: 'Address' },
];

const CriminalDetails: React.FC<CriminalDetailsProps> = ({ criminal }) => {
  return (
        <table className="w-full table-fixed border border-border">
          <tbody>
            {fields.map(({ key, label }) => (
              <tr key={key} className="border-b border-border">
                <td className="bg-muted text-sm font-medium text-foreground p-3 w-1/3">
                  {label}
                </td>
                <td className="text-sm text-center text-foreground p-3">
                  {criminal[key] || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
};

export default CriminalDetails;
