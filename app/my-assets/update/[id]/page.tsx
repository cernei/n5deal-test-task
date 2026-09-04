import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import FormBuilder from '@/app/FormBuilder';
import {assetFormConfiguration} from '../../assetFormConfig';
import {getMyAsset, updateAsset} from '@/app/api';
import {Asset} from "@/app/options";

type PageProps = { params: Promise<{ id: string }> };

function toFormValues(asset: Asset) {
  if (!asset) return {};
  return Object.fromEntries(
      Object.keys(assetFormConfiguration.config).map((field) => [
        field,
        asset[field as keyof Asset] == null ? '' : String(asset[field as keyof Asset]),
      ]),
  );
}

export default async function UpdateAssetPage({ params }: PageProps) {
  const { id } = await params;
  let asset: Asset;

  try {
    asset = await getMyAsset(id);
  } catch (error) {
    console.error('Failed to load asset:', error);
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    const assetData = Object.fromEntries(formData.entries());
    await updateAsset(id, {
      ...assetData,
      yearOfIssue: Number(assetData.yearOfIssue),
      employees: Number(assetData.employees),
      askingPrice: Number(assetData.askingPrice),
    });
    redirect('/my-assets');
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950">Update Asset</h1>
              <p className="mt-1 text-sm text-gray-500">Review and update your asset listing.</p>
            </div>
            <Link href="/my-assets" className="text-sm font-medium text-gray-600 transition hover:text-gray-950">
              Back to My Assets
            </Link>
          </div>
          <FormBuilder configuration={assetFormConfiguration} action={handleSubmit} initialValues={toFormValues(asset)} submitLabel="Update Asset" />
        </div>
      </div>
    </main>
  );
}
