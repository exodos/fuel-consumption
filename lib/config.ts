import axios from "axios";
const dev = process.env.NODE_ENV != "production";

export const baseUrl = `http://localhost:3000`;

// export const baseUrl = dev ? "http://localhost:3000" : "http://localhost:3000";

export const changePhone = (phone: string) => {
  let validPhone = "";

  if (phone.startsWith("0")) {
    validPhone = "251" + phone.slice(1);
  } else if (phone.startsWith("9")) {
    validPhone = "251" + phone;
  } else if (phone.startsWith("+")) {
    validPhone = phone.slice(1);
  } else {
    validPhone = phone;
  }

  return validPhone;
};

export const sourceMapping = [
  { id: "1", name: "TeleBirr" },
  { id: "2", name: "CbeBirr" },
  { id: "3", name: "COOP" },
];

export const regionName = [
  { id: "1", name: "Addis Ababa" },
  { id: "3", name: "Afar" },
  { id: "4", name: "Amhar" },
  { id: "5", name: "Benishangul Gumuz" },
  { id: "6", name: "Dire Dawa" },
  { id: "7", name: "Gambela" },
  { id: "8", name: "Harari" },
  { id: "9", name: "Oromia" },
  { id: "10", name: "SNNP" },
  { id: "11", name: "Somali" },
  { id: "12", name: "Tigray" },
  { id: "2003", name: "Sidama" },
];

export const companyName = [
  { id: "1", name: "ABAC" },
  { id: "2", name: "AFRICAN" },
  { id: "3", name: "BARO" },
  { id: "4", name: "DALOL" },
  { id: "5", name: "DELTA" },
  { id: "6", name: "DIRE" },
  { id: "7", name: "ELELLE" },
  { id: "8", name: "ELLA" },
  { id: "9", name: "Feleghion" },
  { id: "10", name: "Full AM" },
  { id: "11", name: "GLOBAL" },
  { id: "12", name: "GOMEJU" },
  { id: "13", name: "GREEN" },
  { id: "14", name: "HABSHA" },
  { id: "15", name: "HALEFAY" },
  { id: "16", name: "JFM" },
  { id: "17", name: "JR" },
  { id: "18", name: "Kumbi" },
  { id: "19", name: "MESH" },
  { id: "20", name: "Nile" },
  { id: "21", name: "NOC" },
  { id: "22", name: "ODDA" },
  { id: "23", name: "OILIBIYA" },
  { id: "24", name: "OLWAY" },
  { id: "25", name: "PETRO" },
  { id: "26", name: "RUBIS" },
  { id: "27", name: "SKY" },
  { id: "28", name: "TAF" },
  { id: "29", name: "Tebareke" },
  { id: "30", name: "TOTAL" },
  { id: "31", name: "TSEHY" },
  { id: "32", name: "WORKU" },
  { id: "33", name: "YBP" },
  { id: "34", name: "YESHI" },
  { id: "35", name: "ZAGOL" },
  { id: "36", name: "ZEMEN" },
  { id: "37", name: "ZOBLE" },
  { id: "38", name: "KOBIL" },
  { id: "39", name: "Abyssinia" },
  { id: "40", name: "Alpha" },
];
