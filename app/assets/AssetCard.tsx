'use client';

import React from 'react';
import {Asset} from "@/app/options";

type AssetCardProps = { asset: Asset };

const AssetCard = ({asset}: AssetCardProps) => {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {asset.assetType}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            asset.businessStatus === 'Active' 
              ? 'bg-emerald-50 text-emerald-700' 
              : asset.businessStatus === 'Operational'
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {asset.businessStatus}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{asset.country}</h3>
        <p className="text-sm font-medium text-gray-600 mb-4">{asset.typeOfLicense}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-sm">
          <div>
            <span className="block text-xs text-gray-400 font-medium">Business Type</span>
            <span className="font-semibold text-gray-700">{asset.typeOfBusiness}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 font-medium">Regulatory</span>
            <span className="font-semibold text-gray-700">{asset.regulatory}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 font-medium">Year of Issue</span>
            <span className="font-semibold text-gray-700">{asset.yearOfIssue}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 font-medium">Employees</span>
            <span className="font-semibold text-gray-700">{asset.employees}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="block text-xs text-gray-400 font-medium">Asking Price</span>
          <span className="text-lg font-extrabold text-gray-950">{typeof asset.askingPrice === "number" ? "$" + asset.askingPrice.toLocaleString() : "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;