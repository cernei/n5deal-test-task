import Link from "next/link";
import { getMyAssets } from "../api";
import {Asset} from "@/app/options";

export default async function MyAssetsPage() {
    let assets: Asset[] = [];
    try {
        const result = await getMyAssets();
        assets = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Failed to load user assets:", error);
    }
    return <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl"><h1 className="mb-8 text-3xl font-bold text-gray-950">My Assets</h1>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{["Asset", "Country", "License", "Status", "Asking price", ""].map((h) => <th key={h}
                                                                                                  className="px-6 py-3 font-semibold">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">{assets.length ? assets.map((asset) => <tr
                        key={asset.id}>
                        <td className="px-6 py-4">{asset.assetType || "—"}</td>
                        <td className="px-6 py-4">{asset.country || "—"}</td>
                        <td className="px-6 py-4">{asset.typeOfLicense || "—"}</td>
                        <td className="px-6 py-4">{asset.businessStatus || "—"}</td>
                        <td className="px-6 py-4 text-right">{typeof asset.askingPrice === "number" ? "$" + asset.askingPrice.toLocaleString() : "—"}</td>
                        <td className="px-6 py-4 text-right"><Link href={`/my-assets/update/` + asset.id } className="font-medium text-blue-600 hover:text-blue-800">Edit</Link></td>
                    </tr>) : <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No assets found.</td>
                    </tr>}</tbody>
                </table>
            </div>
        </div>
    </main>;
}
