export const ASSET_TYPES = {
  LICENSE_ONLY: 'License only',
  FINTECH_BUSINESS_NOT_LICENSED: 'Fintech business (not licensed)',
  ACTIVE_BUSINESS_LICENCED: 'Active business (Licenced)',
} as const;
export type Asset = {
    id: number;
    assetType?: string;
    country?: string;
    typeOfLicense?: string;
    businessStatus?: string;
    typeOfBusiness?: string;
    regulatory?: string;
    yearOfIssue?: number;
    employees?: number;
    askingPrice?: number;
};
export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

export const assetTypeOptions: AssetType[] = [
  ASSET_TYPES.LICENSE_ONLY,
  ASSET_TYPES.FINTECH_BUSINESS_NOT_LICENSED,
  ASSET_TYPES.ACTIVE_BUSINESS_LICENCED,
];

export const ASSET_TYPE_OPTIONS = assetTypeOptions;

export const countries = [
  "Argentina",
  "Australia",
  "Austria",
  "Bahamas",
  "Bahrain",
  "Belgium",
  "Bermuda",
  "Bosnia and Herzegovina",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Caribbean region",
  "Cayman Islands",
  "Chile",
  "China",
  "Croatia",
  "Curaçao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Dominica",
  "El Salvador",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Gibraltar",
  "Greece",
  "Hong Kong",
  "Hungary",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Japan",
  "Jersey",
  "Kazakhstan",
  "Kenya",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Malaysia",
  "Malta",
  "Mauritius",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Panama",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Romania",
  "Rwanda",
  "Seychelles",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "United Arab Emirates",
  "United Kingdom",
  "United States"
] as const;

export const COUNTRIES = countries;
export const countryOptions: string[] = [...countries];
export const COUNTRY_OPTIONS = countryOptions;
export type Country = typeof countries[number];

export const LICENSE_TYPES = {
  BCRA_PSP_REGISTRATION: 'BCRA PSP Registration (Registro PSP)',
  BANKING_LICENSE: 'Banking license (BL)',
  DIGITAL_ASSET_EXCHANGE: 'Digital Asset Exchange (DAE)',
  INVESTMENT_FUND_AUTHORIZATION: 'Investment Fund / Fund Manager authorization (CNV)',
  PSAV_REGISTRATION: 'PSAV Registration (CNV)',
  PSP_BCRA: 'PSP (BCRA)',
} as const;

export const TYPE_OF_LICENSES = LICENSE_TYPES;
export type LicenseType = typeof LICENSE_TYPES[keyof typeof LICENSE_TYPES];
export type TypeOfLicense = LicenseType;

export const licenseTypeOptions: LicenseType[] = [
  LICENSE_TYPES.BCRA_PSP_REGISTRATION,
  LICENSE_TYPES.BANKING_LICENSE,
  LICENSE_TYPES.DIGITAL_ASSET_EXCHANGE,
  LICENSE_TYPES.INVESTMENT_FUND_AUTHORIZATION,
  LICENSE_TYPES.PSAV_REGISTRATION,
  LICENSE_TYPES.PSP_BCRA,
];

export const LICENSE_TYPE_OPTIONS = licenseTypeOptions;
export const typeOfLicenseOptions = licenseTypeOptions;
export const TYPE_OF_LICENSE_OPTIONS = licenseTypeOptions;

export const BUSINESS_TYPES = {
  BANK: 'Bank',
  FINTECH: 'Fintech',
  GAMBLING: 'Gambling',
  EMI: 'EMI',
  FOREX: 'Forex',
  CRYPTO: 'Crypto',
  PAYMENT: 'Payment',
  REMITTANCES: 'Remittances',
  CROWDFUNDING: 'Crowdfunding',
  INVESTMENT: 'Investment',
  BROKER_DEALER: 'Broker dealer',
  FUND: 'Fund',
  ASSET_MANAGEMENT: 'Asset management',
  INSURANCE: 'Insurance',
  LENDING: 'Lending',
  STABLECOIN: 'Stablecoin',
  TRUST: 'Trust',
  LOAN: 'Loan',
  DEPOSIT: 'Deposit',
  CARD_ISSUING: 'Card issuing',
  E_WALLET: 'E-wallet',
  PAYMENT_ORCHESTRATION: 'Payment Orchestration',
  PSP: 'PSP (Payment Service Provider)',
  DEX: 'DEX',
  CEX: 'CEX',
  PI: 'PI',
  NA: 'N/A',
} as const;

export const TYPE_OF_BUSINESSES = BUSINESS_TYPES;
export type BusinessType = typeof BUSINESS_TYPES[keyof typeof BUSINESS_TYPES];
export type TypeOfBusiness = BusinessType;

export const businessTypeOptions: BusinessType[] = [
  BUSINESS_TYPES.BANK,
  BUSINESS_TYPES.FINTECH,
  BUSINESS_TYPES.GAMBLING,
  BUSINESS_TYPES.EMI,
  BUSINESS_TYPES.FOREX,
  BUSINESS_TYPES.CRYPTO,
  BUSINESS_TYPES.PAYMENT,
  BUSINESS_TYPES.REMITTANCES,
  BUSINESS_TYPES.CROWDFUNDING,
  BUSINESS_TYPES.INVESTMENT,
  BUSINESS_TYPES.BROKER_DEALER,
  BUSINESS_TYPES.FUND,
  BUSINESS_TYPES.ASSET_MANAGEMENT,
  BUSINESS_TYPES.INSURANCE,
  BUSINESS_TYPES.LENDING,
  BUSINESS_TYPES.STABLECOIN,
  BUSINESS_TYPES.TRUST,
  BUSINESS_TYPES.LOAN,
  BUSINESS_TYPES.DEPOSIT,
  BUSINESS_TYPES.CARD_ISSUING,
  BUSINESS_TYPES.E_WALLET,
  BUSINESS_TYPES.PAYMENT_ORCHESTRATION,
  BUSINESS_TYPES.PSP,
  BUSINESS_TYPES.DEX,
  BUSINESS_TYPES.CEX,
  BUSINESS_TYPES.PI,
  BUSINESS_TYPES.NA,
];

export const BUSINESS_TYPE_OPTIONS = businessTypeOptions;
export const typeOfBusinessOptions = businessTypeOptions;
export const TYPE_OF_BUSINESS_OPTIONS = businessTypeOptions;

export const BUSINESS_STATUSES = {
  ACTIVE: 'Active',
  NOT_ACTIVE: 'Not Active',
} as const;

export const BUSINESS_STATUS = BUSINESS_STATUSES;
export type BusinessStatus = typeof BUSINESS_STATUSES[keyof typeof BUSINESS_STATUSES];

export const businessStatusOptions: BusinessStatus[] = [
  BUSINESS_STATUSES.ACTIVE,
  BUSINESS_STATUSES.NOT_ACTIVE,
];

export const BUSINESS_STATUS_OPTIONS = businessStatusOptions;

export const ROLES = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
  PLATFORM_MANAGER: 'Platform Manager',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const roleOptions: Role[] = [
  ROLES.BUYER,
  ROLES.SELLER,
  ROLES.PLATFORM_MANAGER,
];

export const ROLE_OPTIONS = roleOptions;
