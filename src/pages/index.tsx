import { CakeProfitStats } from "backend-feature/calculateCakeProfitFromPool";
import { fetcher } from "backend-feature/utils/fetcher";

import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { generateGetMethodWithQueries } from "backend-feature/utils/generateGetMethodWithQueries";
import { useEffect, useMemo, useState } from "react";
import { getScaledValue } from "backend-feature/utils/getScaledValue";
import { useTransformOutputResponse } from "hooks/useTransformOutputResponse";
import { DashedLine, Row, Table } from "nemo-ui-kit";

const Home: NextPage = () => {
  const { data, error } = useSWR<CakeProfitStats, any>(
    generateGetMethodWithQueries("/api/getSelfCakeStats", {
      address: "0x4460D957A0Ec58a062C899623e743ba3451ED44C",
    }),
    fetcher
  );
  const memoizedOutputResponses = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.outputResponses;
  }, [data]);
  const displayOutputResponses = useTransformOutputResponse(
    memoizedOutputResponses
  );

  if (!displayOutputResponses.length)
    return <div className="m-auto px-2 py-4 bg-red-500">loading...</div>;

  const rows = [
    Object.keys(displayOutputResponses[0]),
    ...displayOutputResponses.map((el) => [...Object.values(el)]),
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Table className="w-2/3 m-auto">
          <DashedLine />
          <Row  isHeading>
            {Object.keys(displayOutputResponses[0].displayData).map((key) => {
              return (
                <span key={key} className="font-bold">
                  {key}
                </span>
              );
            })}
          </Row>
          {displayOutputResponses.map((dOR) => {
            return (
              <Row key={dOR.meta.id}>
                {Object.values(dOR.displayData).map((value, index) => {
                  return <span key={index}>{value}</span>;
                })}
              </Row>
            );
          })}
        </Table>
      </div>
    </div>
  );
};

export default Home;
