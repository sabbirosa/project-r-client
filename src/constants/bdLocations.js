// Bangladesh Geographic Locations Data
// Source: https://github.com/nuhil/bangladesh-geocode

import districtsData from '../data/districts.json';
import upazilasData from '../data/upazilas.json';

// Division mapping based on the JSON data structure
export const divisions = [
  { id: "1", name: "Chittagong", bn_name: "চট্টগ্রাম" },
  { id: "2", name: "Rajshahi", bn_name: "রাজশাহী" },
  { id: "3", name: "Khulna", bn_name: "খুলনা" },
  { id: "4", name: "Barisal", bn_name: "বরিশাল" },
  { id: "5", name: "Sylhet", bn_name: "সিলেট" },
  { id: "6", name: "Dhaka", bn_name: "ঢাকা" },
  { id: "7", name: "Rangpur", bn_name: "রংপুর" },
  { id: "8", name: "Mymensingh", bn_name: "ময়মনসিংহ" }
];

// Extract districts from JSON data
export const districts = districtsData
  .find(item => item.type === "table" && item.name === "districts")
  ?.data.sort((a, b) => a.name.localeCompare(b.name)) || [];

// Extract upazilas from JSON data
export const upazilas = upazilasData
  .find(item => item.type === "table" && item.name === "upazilas")
  ?.data.sort((a, b) => a.name.localeCompare(b.name)) || []; 