'use client';

import { usePathname, useRouter } from 'next/navigation';
import FormBuilder, { FormConfiguration } from '@/app/FormBuilder';
import { countries } from '@/app/options';

type SidebarProps = { min?: string; max?: string; country?: string; onMinChange?: (value: string) => void; onMaxChange?: (value: string) => void; onCountryChange?: (value: string) => void };

const filterConfiguration: FormConfiguration = {
  layout: [['min', 'max'], ['country']],
  config: {
    min: { component: 'number', label: 'Minimum price', placeholder: 'Min', validation: { min: 0 } },
    max: { component: 'number', label: 'Maximum price', placeholder: 'Max', validation: { min: 0 } },
    country: { component: 'select', label: 'Country', options: countries.map((value) => ({ label: value, value })) },
  },
};

export default function Sidebar({ min = '', max = '', country = '', onMinChange, onMaxChange, onCountryChange }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  function handleApply(values: Record<string, string>) {
    onMinChange?.(values.min ?? ''); onMaxChange?.(values.max ?? ''); onCountryChange?.(values.country ?? '');
    const params = new URLSearchParams();
    if (values.min) params.set('min', values.min);
    if (values.max) params.set('max', values.max);
    if (values.country) params.set('country', values.country);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }
  return <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Asset filters">
    <h2 className="text-lg font-semibold text-gray-950">Filters</h2>
    <FormBuilder configuration={filterConfiguration} initialValues={{ min, max, country }} onSubmit={handleApply} submitLabel="Apply" className="mt-5" />
  </aside>;
}
