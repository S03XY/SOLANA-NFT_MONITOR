import * as web3 from "@solana/web3.js";
import * as meta from "@metaplex/js";

let connection = new web3.Connection(web3.clusterApiUrl("devnet"));
window.globalarray = [];
// export const getconnection = async () => {
//   console.log("getting connection..");
//   let user = await window.solana.connect();
//   return user.publicKey.toString();
// };

export const accountchnageevent = () => {
  console.log("running account change event..");

  let nfttomonitor = new web3.PublicKey(
    "2MGzbVhVmw6dQjtTUBsMxAT8n6jftcmbdrWitKfuceRF"
  );

  connection.onAccountChange(nfttomonitor, (e) => {
    console.log("nft has been tranfered...");
    console.log("nft has been tranfered...", e);
  });
};

export const convertpubkey = (arr) => {
  let pubarr = [];
  let final_array = arr.split(",");
  final_array.forEach((item) => {
    pubarr.push(new web3.PublicKey(item));
  });

  return pubarr;
};

export const getconnectionsolana = () => {
  return connection;
};
export const logevent = (pubarray) => {
  console.log("running log events");

  pubarray.forEach((item) => {
    console.log("mint", item.toString());
    connection.onLogs(item, async (e) => {
      let sigstatus = await connection.getSignatureStatus(e.signature);
      console.log("signature status", sigstatus);

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
    });
  });
};

export const fetchnftinfo = async (nfts) => {
  let finalnftinfo = [];

  for (let item of nfts) {
    let mintpubkey = new web3.PublicKey(item);
    let data = await meta.programs.metadata.Metadata.findByMint(
      connection,
      mintpubkey
    );

    let lookupdata = await meta.utils.metadata.lookup(data.data.data.uri);

    let pushed_data = {
      name: data.data.data.name,
      uri: lookupdata.image,
      symbol: data.data.data.symbol,
    };

    finalnftinfo.push(pushed_data);
  }

  // console.log("final info array",finalnftinfo)

  return finalnftinfo;
};
