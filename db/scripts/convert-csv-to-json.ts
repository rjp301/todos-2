import fs from "fs/promises";

const numberFields = [
  "sortOrder",
  "quantity",
  "githubId",
  "expiresAt",
  // "weight",
];
const booleanFields = [
  "packed",
  "wornWeight",
  "consWeight",
  "showImages",
  "showPrices",
  "showPacked",
  "showWeights",
];
const nullFields = ["image"];

const convertCsvToJson = async (csvPath: string) => {
  const csv = await fs.readFile(csvPath, "utf-8");
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((acc, header, i) => {
      let value: any = values[i]?.replace(/"/g, "");

      if (booleanFields.includes(header))
        value = value === "true" ? true : false;

      if (numberFields.includes(header)) value = Number(value);

      if (nullFields.includes(header) && value === "") value = null;

      // @ts-ignore
      acc[header] = value;
      return acc;
    }, {});
  });
  console.log(data);
  return data;
};

export default function convertCsvsToJson() {
  const csvs = [
    "db/data/category_item.csv",
    "db/data/category.csv",
    "db/data/item.csv",
    "db/data/list.csv",
    "db/data/user_session.csv",
    "db/data/user.csv",
  ];
  csvs.forEach(async (csv) => {
    const json = await convertCsvToJson(csv);
    const jsonPath = csv.replace(".csv", ".json");
    await fs.writeFile(jsonPath, JSON.stringify(json, null, 2));
  });
}

convertCsvsToJson();
