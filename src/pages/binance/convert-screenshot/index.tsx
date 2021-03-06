import Image from "next/image";
import { base03, base2, cyan, green, yellow } from "theme/colors";
import axios from "axios";

import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { copyToClipboard } from "utils/copyToClipboard";
import { parseFloatButTreatCommaAsDot } from "utils/parseFloatButTreatCommaAsDot";
import { LoadingSpinner } from "components/LoadingSpinner";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const Icon = dynamic(async () => (await import("reactjs-stack-icons")).Icon, {
  ssr: false,
});

function CopyableText(props: { textValue: string }) {
  const { textValue } = props;
  return (
    <code
      onClick={() => {
        copyToClipboard(textValue);
      }}
      style={{
        maxWidth: 168,
      }}
      className="bg-slate-400 rounded-md mr-2 px-2 cursor-pointer flex w-min items-center"
    >
      <div className="mr-2">
        <Icon height={24} width={24} name="Copy" />
      </div>
      <span
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {textValue}
      </span>
    </code>
  );
}

function ConsumableText(props: { extractedText: string }) {
  const [toggleRate, setToggleRate] = useState(false);
  const [decimalNotation, setDecimalNotation] = useState<"." | ",">(",");
  const { extractedText } = props;
  const convertFromValue = parseFloatButTreatCommaAsDot(
    extractedText.split("\n")[0].split(" ")[1]
  );
  const convertFromSymbol = extractedText.split("\n")[0].split(" ")[2];
  const ratePair: { symbol: string; value: number }[] = (() => {
    const rawSplitted = extractedText.split("\n")[1].split(" ");
    return [
      {
        symbol: rawSplitted[2],
        value: parseFloatButTreatCommaAsDot(rawSplitted[1]),
      },
      {
        symbol: rawSplitted[5],
        value: parseFloatButTreatCommaAsDot(rawSplitted[4]),
      },
    ];
  })();
  console.log(
    "🚀 ~ file: index.tsx ~ line 24 ~ ConsumableText ~ ratePair",
    ratePair
  );
  const convertTo = (() => {
    if (convertFromSymbol === ratePair[0].symbol) {
      return {
        value: ratePair[1].value * convertFromValue,
        symbol: ratePair[1].symbol,
      };
    }
    if (convertFromSymbol === ratePair[1].symbol) {
      return {
        value: ratePair[0].value * convertFromValue,
        symbol: ratePair[0].symbol,
      };
    }
  })();

  const consumableConvertFromValue = useMemo(() => {
    if (decimalNotation === ".") {
      return convertFromValue.toString();
    }
    if (decimalNotation === ",") {
      return convertFromValue.toString().replace(".", ",");
    }
  }, [decimalNotation, convertFromValue]);
  const consumableConvertToValue = useMemo(() => {
    if (decimalNotation === ".") {
      return convertTo.value.toString();
    }
    if (decimalNotation === ",") {
      return convertTo.value.toString().replace(".", ",");
    }
  }, [decimalNotation, convertTo.value]);
  const consumableRate1 = useMemo(() => {
    if (decimalNotation === ".") {
      return ratePair[1].value.toString();
    }
    if (decimalNotation === ",") {
      return ratePair[1].value.toString().replace(".", ",");
    }
  }, [ratePair, decimalNotation]);
  const consumableRate2 = useMemo(() => {
    if (decimalNotation === ".") {
      return (1 / ratePair[1].value).toString();
    }
    if (decimalNotation === ",") {
      return (1 / ratePair[1].value).toString().replace(".", ",");
    }
  }, [ratePair, decimalNotation]);

  return (
    <MobileLikeContainer className="p-4">
      <h1 className="text-3xl text-center mb-8 font-bold ">CONVERT</h1>
      <div
        className="text-5xl m-auto mb-8 w-min"
        style={{
          color: cyan,
        }}
      >
        ✔
      </div>

      <div className="flex">
        <div className="mr-2" style={{ width: 46.92 }}>
          From
        </div>
        <CopyableText textValue={`${consumableConvertFromValue}`} />
        {convertFromSymbol}
        <br />
      </div>
      <br />
      <span className="flex">
        <div className="mr-2" style={{ width: 46.92 }}>
          To
        </div>
        <CopyableText textValue={`${consumableConvertToValue}`} />

        {convertTo.symbol}
      </span>

      <br />
      <b>RATE:</b>
      <br />
      <span className="flex whitespace-nowrap">
        {!toggleRate && (
          <>
            <span className="block mr-2">
              {ratePair[0].value} {ratePair[0].symbol} =
            </span>
            <CopyableText textValue={consumableRate1} />
            <span>{ratePair[1].symbol}</span>
          </>
        )}
        {toggleRate && (
          <>
            <span className="block mr-2">1 {ratePair[1].symbol} = </span>
            <CopyableText textValue={consumableRate2} />
            <span> {ratePair[0].symbol}</span>
          </>
        )}
      </span>

      <br />

      <div className="block mt-2">
        <div className="flex flex-row items-center mb-2 justify-between">
          <span>Toggle rate:</span>
          <button
            style={{
              width: 48,
              height: 48,
            }}
            className="flex items-center mr-2 bg-amber-300 p-2 rounded-md"
            onClick={() => {
              setToggleRate(!toggleRate);
              // toast("🔁 Rate inversed");
            }}
          >
            <Icon name="ArrowLeftAlt" width={16} height={16} />
            <Icon name="ArrowRightAlt" width={16} height={16} />
          </button>
        </div>
        <div className="flex flex-row items-center mb-2 justify-between">
          <span>Change decimal notation:</span>
          <button
            style={{
              backgroundColor: base03,
              color: "white",
              width: 48,
              height: 48,
            }}
            className="flex items-center justify-center mr-2 p-2 rounded-md"
            onClick={() => {
              if (decimalNotation === ",") {
                setDecimalNotation(".");
              }
              if (decimalNotation === ".") {
                setDecimalNotation(",");
              }
              // toast("🗣 Decimal notation changed");
            }}
          >
            <span>, / .</span>
          </button>
        </div>
        <div className="flex flex-row items-center mb-2 justify-between">
          <span>Copy all into 3 cells:</span>
          <button
            style={{
              backgroundColor: cyan,
              color: "white",
              width: 48,
              height: 48,
            }}
            className="flex items-center justify-center mr-2 p-2 rounded-md"
            onClick={() => {
              copyToClipboard(
                `${consumableConvertFromValue} \t ${consumableConvertToValue} \t ${
                  toggleRate ? consumableRate2 : consumableRate1
                }`
              );
            }}
          >
            <Icon name="Copy" width={24} height={24} />
          </button>
        </div>
      </div>
      <div
        style={{ backgroundColor: base2, borderColor: base03 }}
        className="rounded-md mt-4 py-2 w-100 border-2 border-solid"
      >
        <span
          onClick={() => window.location.reload()}
          className="m-auto block w-min whitespace-nowrap"
          style={{ color: base03 }}
        >
          Try another screenshot
        </span>
      </div>
    </MobileLikeContainer>
  );
}

const MobileLikeCss = css`
  position: relative;
  width: 100%;
  max-width: 390px;
  min-height: 100vh;
  border-radius: 8px;
  border: 2px dashed ${base03};
  font-size: 21px;

  color: ${base03};
`;

const MobileLikeContainer = styled.div`
  ${MobileLikeCss}
`;

const CustomizeFileUploadWrapper = styled.div`
  // keep the input file visible for accessibility
  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .inputfile + label {
    ${MobileLikeCss}
  }

  .inputfile:focus + label,
  .inputfile + label:hover {
    cursor: pointer;
    background-color: ${base2};
  }
`;

function CustomizeFileUpload(props: {
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <CustomizeFileUploadWrapper>
      <input
        onChange={async (e) => {
          setIsLoading(true);
          await props.changeHandler(e);
          setIsLoading(false);
        }}
        accept="image/png, image/jpeg, image/jpg"
        type="file"
        id="file"
        className="inputfile"
        disabled={isLoading}
      />
      <label
        className="flex flex-col items-center justify-center"
        htmlFor="file"
      >
        {isLoading && (
          <>
            <LoadingSpinner className="text-3xl w-min" />
            <div className="mt-3">it might take up to one minute...</div>
          </>
        )}
        {!isLoading && (
          <>
            <Image
              width={64}
              height={64}
              alt="uni-logo"
              src={require("assets/binance-convert.svg")}
            />
            <span className="block mt-4 mb-4 text-center">
              Tap to upload your <br /> convert screenshot, <br /> like this
            </span>{" "}
            <div
              style={{ borderRadius: "5px", height: 284, overflow: "hidden" }}
            >
              <Image
                objectFit="contain"
                width={160}
                height={284}
                alt="demo"
                src={require("./demo.jpg")}
              />
            </div>
          </>
        )}
      </label>
    </CustomizeFileUploadWrapper>
  );
}

function ConvertScreenshot() {
  const [extractedText, setExtractedText] = useState("");
  console.log(
    "🚀 ~ file: index.tsx ~ line 320 ~ process.env.NEXT_PUBLIC_SERVER_URL",
    process.env.NEXT_PUBLIC_SERVER_URL
  );

  const changeHandler = useCallback(
    async (event: any) => {
      let data = new FormData();
      data.append("name", "convert-screenshot.csv");
      data.append("file", event.target.files[0]);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const rs = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/convert-binance-screenshot`,
        data,
        config
      );
      // this cause re-render
      setExtractedText(rs.data);
      // this cause another re-render 🤷‍♂️
    },
    [extractedText]
  );
  return (
    <div className="m-auto p-4">
      <div>
        {!!extractedText && <ConsumableText extractedText={extractedText} />}
        {!extractedText && (
          <CustomizeFileUpload changeHandler={changeHandler} />
        )}
      </div>
      <span className="block text-center mt-4">
        A gift from{" "}
        <a
          className="text-blue-500"
          href="https://twitter.com/phamhuyphat"
          rel="noreferrer"
          target="_blank"
        >
          Nemo The Collector
        </a>
      </span>
    </div>
  );
}

export default ConvertScreenshot;
