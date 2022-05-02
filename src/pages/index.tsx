import { CakeProfitStats } from "backend-feature/calculateCakeProfitFromPool";
import { fetcher } from "backend-feature/utils/fetcher";
import AsciiTable from "ascii-data-table";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { generateGetMethodWithQueries } from "backend-feature/utils/generateGetMethodWithQueries";
import { useEffect, useState } from "react";
import { getScaledValue } from "backend-feature/utils/getScaledValue";

const Home: NextPage = () => {
  const { data, error } = useSWR<CakeProfitStats, any>(
    generateGetMethodWithQueries("/api/getSelfCakeStats", {
      address: "0x4460D957A0Ec58a062C899623e743ba3451ED44C",
    }),
    fetcher
  );
  const [address, setAddress] = useState("");
  const [asciiMaxWidth, setAsciiMaxWidth] = useState(
    getScaledValue(window.innerWidth, 320, 1200, 8, 18)
  );
  useEffect(() => {
    function handleResize() {
      setAsciiMaxWidth(getScaledValue(window.innerWidth, 320, 1200, 8, 18));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) return <div className="m-auto px-2 py-4">loading...</div>;
  const rows = [
    Object.keys(data.outputResponses[0]),
    ...data.outputResponses.map((el) => [...Object.values(el)]),
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          margin: "auto",
          maxWidth: 1200,
          width: "100%",
        }}
      >
        <pre
          style={{ textAlign: "center" }}
          dangerouslySetInnerHTML={{
            __html: AsciiTable.table(rows, asciiMaxWidth),
          }}
        />
      </div>
    </div>
  );
};

export default Home;
