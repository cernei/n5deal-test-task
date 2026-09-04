import FormBuilder from '@/app/FormBuilder';
import { assetFormConfiguration } from '../assetFormConfig';
import { createAsset } from '@/app/api';

export default function CreateAssetPage() {
  async function handleSubmit(formData: FormData) {
    'use server';

    const assetData = Object.fromEntries(formData.entries());

    await createAsset({
      ...assetData,
      yearOfIssue: Number(assetData.yearOfIssue),
      employees: Number(assetData.employees),
      askingPrice: Number(assetData.askingPrice),
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">Create Asset</h1>
            <p className="mt-1 text-sm text-gray-500">Configure and list a new asset for acquisition.</p>
          </div>
          <FormBuilder configuration={assetFormConfiguration} action={handleSubmit} submitLabel="Create Asset" />
        </div>
      </div>
    </main>
  );
}
