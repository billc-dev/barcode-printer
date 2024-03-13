"use client";

import { Button, Input } from "@nextui-org/react";
import clsx from "clsx";
import { useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";

export default function Home() {
  const [state, setState] = useState({ title: "", barcode: "", price: "" });
  const componentRef = useRef<HTMLDivElement>(null);
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

  return (
    <main className="p-4 max-w-xl mx-auto gap-4">
      <div className="grid grid-cols-3">
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
  title,
  barcode,
  price,
  forPrint,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col overflow-hidden justify-center text-sm items-center h-[30mm] w-[40mm] rounded text-center",
        !forPrint && "outline outline-gray-200"
      )}
    >
      <p className="text-sm mb-1">
        {title.trim() === "" ? "品名" : title.trim()}
      </p>
      <div className="w-full flex justify-center items-center">
        <Barcode
          value={barcode.trim() === "" ? "12345678" : barcode.trim()}
          height={30}
          width={1}
          // marginTop={0}
          // marginBottom={0}
          margin={0}
          displayValue={false}
        />
      </div>
      <p className="text-xs block">
        {barcode.trim() === "" ? "12345678" : barcode.trim()}
      </p>
      <p>售價${price.trim() === "" ? "8888" : price.trim()}</p>
    </div>
  );
};
