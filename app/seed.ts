"use server";
import * as XLSX from "xlsx";

import fs from "fs";
import { database } from "./database";
export async function seed() {
  console.log("what");
  const file = fs.readFileSync(process.cwd() + "/13184.xls");
  const workbook = XLSX.read(file);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const [first, ...jsonData] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(jsonData);
  //   await database.product.createMany()
  await database.product.deleteMany();
  await database.product.createMany({
    data: jsonData.map((item) => ({
      number: item[1],
      name: item[2],
      stock: Number(item[4]),
      price: Number(item[5]),
      cost: Number(item[6]),
      description: item[7],
      barcode: item[1],
    })),
  });

  return { jsonData };
}
