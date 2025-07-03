import React from 'react';

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
  { key: 'name', label: 'الاسم' },
  { key: 'nationalId', label: 'رقم الهوية الوطنية' },
  { key: 'job', label: 'الوظيفة' },
  { key: 'bod', label: 'تاريخ الميلاد' },
  { key: 'motherName', label: 'اسم الأم' },
  { key: 'stageName', label: 'اسم الشهرة' },
  { key: 'impersonation', label: 'الانتحال' },
  { key: 'address', label: 'العنوان' },
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
