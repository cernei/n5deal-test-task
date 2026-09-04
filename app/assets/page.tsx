import AssetCard from './AssetCard';
import Sidebar from './Sidebar';
import { getAssets } from '@/app/api';
import {Asset} from '@/app/options';

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ min?: string; max?: string; country?: string }> }) {
  const params = await searchParams;
  const result = await getAssets(params);
  const assets: Asset[] = Array.isArray(result) ? result : [];
  let content;
  if (assets.length === 0) {
    content = <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"><p className={"text-4xl"}>No data</p></main>;
  } else {
    content = (
      <div className="grid grid-cols-1 gap-3">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-950 tracking-tight">Available Assets</h2>
          <p className="text-sm text-gray-500 mt-1">Browse verified regulatory licenses and fintech businesses for acquisition.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
          <Sidebar key={`${params.min ?? ''}-${params.max ?? ''}-${params.country ?? ''}`} min={params.min ?? ''} max={params.max ?? ''} country={params.country ?? ''} />
          { content }
        </div>
      </div>
    </main>
  );
}
