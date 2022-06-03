import axios from "axios";
import React, { useState } from "react";

function BinancePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };
  const processSpot = () => {
    let data = new FormData();

    data.append("name", "transaction-history.csv");
    data.append("file", selectedFile);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios.post("/api/processSpot", data, config).then((rs) => {
      console.log("🚀 ~ file: index.tsx ~ line 22 ~ axios.post ~ rs", rs);
    });
  };
  return (
    <div className="m-auto p-2">
      <div>
        <b>Step 1:</b> Get your spot trading transaction history by following
        this{" "}
        <a
          href="https://www.binance.com/en-AU/support/faq/e4ff64f2533f4d23a0b3f8f17f510eab"
          target="_blank"
          rel="noreferrer"
        >
          instruction
        </a>
      </div>
      <div>
        <div>
          <b>Step 2:</b> Upload your exported <code>.csv</code> file
        </div>
        <input type="file" onChange={changeHandler} accept=".csv" />
      </div>
      <div>
        <div>
          <b>Step 3:</b> Press the button and wait for the result
        </div>
        <div>
          <button
            onClick={() => {
              processSpot();
            }}
          >
            [Process]
          </button>
        </div>
      </div>
    </div>
  );
}

export default BinancePage;
