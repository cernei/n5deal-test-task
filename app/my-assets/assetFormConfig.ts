import { FormConfiguration } from '../FormBuilder';
import {
  assetTypeOptions,
  businessStatusOptions,
  countryOptions,
  licenseTypeOptions,
  businessTypeOptions,
} from '@/app/options';

export const assetFormConfiguration: FormConfiguration = {
  layout: [
    ['country', 'assetType'],
    ['typeOfLicense', 'typeOfBusiness'],
    ['businessStatus', 'regulatory'],
    ['yearOfIssue', 'employees'],
    ['askingPrice'],
  ],
  config: {
    country: {
      component: 'select',
      label: 'Country',
      options: countryOptions,
      validation: { required: true },
    },
    assetType: {
      component: 'select',
      label: 'Asset Type',
      options: assetTypeOptions,
      validation: { required: true },
    },
    typeOfLicense: {
      component: 'select',
      label: 'Type of License',
      options: licenseTypeOptions,
      validation: { required: true },
    },
    typeOfBusiness: {
      component: 'select',
      label: 'Type of Business',
      options: businessTypeOptions,
      validation: { required: true },
    },
    businessStatus: {
      component: 'select',
      label: 'Business Status',
      options: businessStatusOptions,
      validation: { required: true },
    },
    regulatory: {
      component: 'text',
      label: 'Regulatory Body',
      placeholder: 'e.g. FinCEN, FCA, SEC',
      validation: { required: true },
    },
    yearOfIssue: {
      component: 'number',
      label: 'Year of Issue',
      placeholder: 'e.g. 2020',
      validation: { required: true, min: 1900 },
    },
    employees: {
      component: 'number',
      label: 'Employees',
      placeholder: 'e.g. 15',
      validation: { required: true, min: 0 },
    },
    askingPrice: {
      component: 'number',
      label: 'Asking Price ($)',
      placeholder: 'e.g. 500000',
      validation: { required: true, min: 0 },
    },
  },
};
