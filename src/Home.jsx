import React, { useEffect, useState } from "react";
import * as apis from "./api";
import "./Home.css";

export const Home = () => {
  // const [user, setUser] = useState("");
  const [nfttrack, setnfttrack] = useState([]);
  const [nftlist, setnftlist] = useState([]);
  const [monitornft, setmonitornft] = useState([]);
  const [starttracking, setstarttracking] = useState(false);
  const [loading, setloading] = useState(false);

  const getnftevents = (pubarray) => {
    console.log("Monitoring started for NFTs..");
    let connection = apis.getconnectionsolana();

    pubarray.forEach((item) => {
      console.log("mint", item.toString());
      connection.onLogs(item, async (e) => {
        // let sigstatus = await connection.getSignatureStatus(e.signature);
        // console.log("signature status", sigstatus);

        let txn = await connection.getTransaction(e.signature);
        console.log("sign txn", txn);

        let ptxn = await connection.getParsedTransaction(e.signature);
        console.log("sig parsed txn", ptxn);

        let pushed_data = {
          authority:
            ptxn.transaction.message.instructions[
              ptxn.transaction.message.instructions.length - 1
            ].parsed.info.authority,
          destination:
            ptxn.transaction.message.instructions[
              ptxn.transaction.message.instructions.length - 1
            ].parsed.info.destination,
          mint: ptxn.transaction.message.instructions[
            ptxn.transaction.message.instructions.length - 1
          ].parsed.info.mint,
          source:
            ptxn.transaction.message.instructions[
              ptxn.transaction.message.instructions.length - 1
            ].parsed.info.source,
          time: new Date().getTime(),
          signature: e.signature,
        };

        // console.log("before pushing", nfttrack);
        let nfts = nfttrack;
        nfts.push(pushed_data);
        console.log("nfts...", nfts);
        // setnfttrack([...nfttrack, pushed_data]);
        console.log(
          "mint",
          ptxn.transaction.message.instructions[
            ptxn.transaction.message.instructions.length - 1
          ].parsed.info.mint
        );
        let uniqueArray = nfts.filter((value, index) => {
          const _value = JSON.stringify(value);
          return (
            index ===
            nfts.findIndex((nfts) => {
              return JSON.stringify(nfts) === _value;
            })
          );
        });

        console.log("unique array", uniqueArray);

        setnfttrack([...uniqueArray]);
        // console.log("after pushing", nfttrack);
      });
    });
  };

  return (
    <div>
      <h1>NFT - Tracking - System | Build On Solana</h1>
      <p>
        Description: This program track nfts when ever they are sent from one
        wallet to other wallet.Is usually takes{" "}
        <b style={{ fontSize: "20px" }}> 5-7 </b>seconds to appear here.
      </p>

      <h4>Enter the nfts to track</h4>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setmonitornft(e.target.value.trim().split(","));
            let pub_array = apis.convertpubkey(e.target.value.trim());
            setnftlist(pub_array);
          }}
        />
        <button
          style={{ marginLeft: "10px" }}
          onClick={async () => {
            // apis.logevent(nftlist, count, setcount);
            getnftevents(nftlist);
            setloading(true);
            let nftinfo = await apis.fetchnftinfo(nftlist);
            setmonitornft([...nftinfo]);
            setstarttracking(true);
            setloading(false);
          }}
        >
          Start Tracking
        </button>
        <span style={{ marginLeft: "10px" }}>
          {loading ? "loading..." : ""}
        </span>
      </div>

      <h3>Monitored NFTS</h3>
      <div className="monitoringbox">
        {monitornft.length === 0 ? (
          <h3> Nothing To Monitor !</h3>
        ) : // <div></div>
        starttracking ? (
          monitornft.map((item, index) => (
            <div className="nftcontainer" key={index}>
              <h3>{item.name}</h3>
              <h3>{item.symbol}</h3>
              <img src={item.uri} alt="tokenimg" />
            </div>
          ))
        ) : (
          <h3> Nothing To Monitor !</h3>
        )}
      </div>

      <div className="customtable">
        <table>
          <tr>
            <th>S.No</th>
            <th>authority</th>
            <th>destination</th>
            <th>mint</th>
            <th>source</th>
            <th>Time</th>
            <th>Signature</th>
          </tr>

          {nfttrack.map((item, index) => (
            <tr key={index} className="datarow">
              <td>{index + 1}</td>
              <td
                onClick={() => {
                  window.navigator.clipboard.writeText(item.authority);
                  alert("Copied");
                }}
              >{`${item.authority.slice(0, 7)}...${item.authority.slice(
                37,
                44
              )}`}</td>
              <td
                onClick={() => {
                  window.navigator.clipboard.writeText(item.destination);
                  alert("Copied");
                }}
              >{`${item.destination.slice(0, 7)}...${item.destination.slice(
                37,
                44
              )}`}</td>
              <td
                onClick={() => {
                  window.navigator.clipboard.writeText(item.mint);
                  alert("Copied");
                }}
              >{`${item.mint.slice(0, 7)}...${item.mint.slice(37, 44)}`}</td>
              <td
                onClick={() => {
                  window.navigator.clipboard.writeText(item.source);
                  alert("Copied");
                }}
              >{`${item.source.slice(0, 7)}...${item.source.slice(
                37,
                44
              )}`}</td>

              <td>{`${new Date(item.time).getDate()}/${new Date(
                item.time
              ).getMonth()}/${new Date(item.time).getFullYear()} | ${new Date(
                item.time
              ).getHours()}:${new Date(item.time).getMinutes()}:${new Date(
                item.time
              ).getSeconds()} `}</td>
              <td
                onClick={() => {
                  window.navigator.clipboard.writeText(item.signature);
                  alert("Copied");
                }}
              >{`${item.signature.slice(0, 10)}...${item.signature.slice(
                item.signature.length - 10,
                item.signature.length
              )}`}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};
