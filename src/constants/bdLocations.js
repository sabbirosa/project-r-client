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

// ===== UTILITY FUNCTIONS =====

export const getUpazilasbyDistrictId = (districtId) => {
  if (!districtId) return [];
  return upazilas.filter((upazila) => upazila.district_id === districtId);
};

export const getUpazilasbyDistrictName = (districtName) => {
  if (!districtName) return [];
  const district = districts.find(d => d.name === districtName);
  if (!district) return [];
  return upazilas.filter((upazila) => upazila.district_id === district.id);
};

export const getDistrictById = (districtId) => {
  if (!districtId) return null;
  return districts.find(d => d.id === districtId) || null;
};

export const getDistrictByName = (districtName) => {
  if (!districtName) return null;
  return districts.find(d => d.name === districtName) || null;
};

export const getUpazilaById = (upazilaId) => {
  if (!upazilaId) return null;
  return upazilas.find(u => u.id === upazilaId) || null;
};

export const getUpazilaByName = (upazilaName) => {
  if (!upazilaName) return null;
  return upazilas.find(u => u.name === upazilaName) || null;
};

export const getDivisionByDistrictId = (districtId) => {
  if (!districtId) return null;
  const district = getDistrictById(districtId);
  if (!district) return null;
  return divisions.find(div => div.id === district.division_id) || null;
};

export const getDivisionByDistrictName = (districtName) => {
  if (!districtName) return null;
  const district = getDistrictByName(districtName);
  if (!district) return null;
  return divisions.find(div => div.id === district.division_id) || null;
};

export const getDistrictsByDivisionId = (divisionId) => {
  if (!divisionId) return [];
  return districts.filter(d => d.division_id === divisionId);
};

export const convertLocationIdsToNames = (districtId, upazilaId) => {
  const district = getDistrictById(districtId);
  const upazila = getUpazilaById(upazilaId);
  
  return {
    districtName: district?.name || districtId,
    upazilaName: upazila?.name || upazilaId
  };
};

export const convertLocationNamesToIds = (districtName, upazilaName) => {
  const district = getDistrictByName(districtName);
  const upazila = getUpazilaByName(upazilaName);
  
  return {
    districtId: district?.id || "",
    upazilaId: upazila?.id || ""
  };
}; 