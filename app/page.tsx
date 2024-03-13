"use client";
import { HotTable, HotTableClass } from "@handsontable/react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import clsx from "clsx";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

registerAllModules();

export default function Home() {
  const [state, setState] = useState({ title: "", barcode: "", price: "" });
  const [data, setData] = useState(undefined);
  const componentRef = useRef<HTMLDivElement>(null);
  const hotTable = useRef<HotTableClass>(null);
  const [index, setIndex] = useState({ title: 0, barcode: 1, price: 2 });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
    @page {
      size: 40mm 30mm
    };
    @media all {
      .pageBreak {
        display: none
      }
    };
    @media print {
      .pageBreak {
        page-break-after: always
      }
    };
    `,
  });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result || typeof e.target.result === "string") {
        return;
      }
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // Assuming you only have one sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setData(jsonData as any);
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  // useEffect(() => {
  //   if (!hotTable.current) {
  //     return;
  //   }
  // }, [hotTable]);

  return (
    <main className="gap-4">
      <div className="grid p-4 grid-cols-3 max-w-xl mx-auto">
        <div></div>
        <h1 className="text-2xl col-span-2 font-medium mb-2 ml-2 text-center">
          條碼產生器
        </h1>
        <div className="flex items-center justify-center">
          <BarcodeComponent
            title={state.title}
            barcode={state.barcode}
            price={state.price}
          />
        </div>

        <div className="flex gap-2 flex-col col-span-2">
          <Input
            label="品名"
            value={state.title}
            onValueChange={(value) =>
              setState((state) => ({ ...state, title: value }))
            }
          />
          <Input
            label="條碼"
            value={state.barcode}
            onValueChange={(value) =>
              setState((state) => ({ ...state, barcode: value }))
            }
          />
          <Input
            label="售價"
            value={state.price}
            onValueChange={(value) =>
              setState((state) => ({ ...state, price: value }))
            }
          />
        </div>
        <div></div>
        <Button
          className="col-span-2 mt-4"
          onClick={handlePrint}
          fullWidth
          color="primary"
        >
          列印
        </Button>
      </div>
      <div className="hidden">
        <div ref={componentRef}>
          <BarcodeComponent
            forPrint
            title={state.title}
            barcode={state.barcode}
            price={state.price}
          />
        </div>
      </div>
      <div className="mx-2 mb-2">
        <p>選擇 Excel 或 csv 檔案</p>
        <input type="file" onChange={handleFileChange} />
      </div>
      {data && (
        <>
          <div className="grid grid-cols-3 gap-2 mx-2 mb-2">
            <Select
              label="品名"
              selectedKeys={[index.title.toString()]}
              onSelectionChange={(keys) => {
                setIndex((index) => ({
                  ...index,
                  title: Number([...keys][0]),
                }));
              }}
              items={data[0].map((value, index) => ({
                label: value,
                value: index,
              }))}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              label="條碼"
              selectedKeys={[index.barcode.toString()]}
              onSelectionChange={(keys) =>
                setIndex((index) => ({
                  ...index,
                  barcode: Number([...keys][0]),
                }))
              }
              items={data[0].map((value, index) => ({
                label: value,
                value: index,
              }))}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              label="售價"
              selectedKeys={[index.price.toString()]}
              onSelectionChange={(keys) =>
                setIndex((index) => ({ ...index, price: Number([...keys][0]) }))
              }
              items={data[0].map((value, index) => ({
                label: value,
                value: index,
              }))}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          </div>
          <HotTable
            ref={hotTable}
            data={data}
            readOnly
            rowHeaders
            colHeaders
            height={450}
            licenseKey="non-commercial-and-evaluation"
            renderAllRows={false}
            fixedRowsTop={1}
            dropdownMenu
            contextMenu
            search
            filters
            autoWrapRow
            navigableHeaders
            afterSelectRows={(props) => {
              const row = data[props.row];
              setState({
                title: row[index.title]?.toString() ?? "",
                barcode:
                  (row[index.barcode] as string)
                    ?.toString()
                    .replace(/^13184/, "") ?? "",
                price: row[index.price]?.toString() ?? "",
              });
            }}
          />
        </>
      )}
    </main>
  );
}

interface BarcodeComponentProps {
  title: string;
  barcode: string;
  price: string;
  forPrint?: boolean;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({
  forPrint,
  ...props
}) => {
  const title = !props.title.trim() ? "品名" : props.title.trim();
  const barcode = !props.barcode.trim() ? "12345678" : props.barcode.trim();
  const price = !props.price.trim() ? "5678" : props.price.trim();

  return (
    <div
      className={clsx(
        "flex flex-col font-medium overflow-hidden justify-center text-sm items-center p-1 h-[30mm] w-[40mm] rounded text-center",
        !forPrint && "outline outline-gray-200"
      )}
    >
      <p className="text-sm">{title}</p>
      <div id="barcode" className="w-full flex justify-center items-center">
        <Barcode
          value={barcode}
          height={30}
          width={1}
          margin={0}
          displayValue={false}
        />
      </div>
      <p className="text-xs block leading-3">{barcode}</p>
      <p>售價${price}</p>
    </div>
  );
};
