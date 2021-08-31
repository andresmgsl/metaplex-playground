import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey } from "@solana/web3.js";

const CLUSTER_URL = "https://solana-api.projectserum.com/";

const METADATA_PROGRAM_ID = new PublicKey(
  "metaTA73sFPqA8whreUbBsbn3SLJH2vhrW9fP5dmfdC"
);

const decodeText = (text) =>
  new TextDecoder("utf-8").decode(
    new Uint8Array(text.filter((segment) => segment !== 0))
  );

const onWalletConnected = async (
  connection: Connection,
  wallet: PhantomWalletAdapter
) => {
  console.log(connection, wallet);
  const programAccounts = await connection.getProgramAccounts(
    METADATA_PROGRAM_ID
  );
  console.log(programAccounts);
  programAccounts.forEach((element) => {
    const a = decodeText(element.account.data);
    console.log(a);
  });
};

const connectButton = document.getElementById("connect");
const disconnectButton = document.getElementById("disconnect");

const main = async () => {
  const connection = new Connection(CLUSTER_URL, "confirmed");
  const wallet = new PhantomWalletAdapter();

  wallet.on("disconnect", () => location.reload());
  wallet.on("connect", () => onWalletConnected(connection, wallet));
  wallet.on("ready", () => {
    window.localStorage.getItem("autoConnect") === "true" && wallet.connect();
  });

  connectButton.addEventListener("click", () => {
    wallet.connect();
    window.localStorage.setItem("autoConnect", "true");
  });

  disconnectButton.addEventListener("click", () => {
    wallet.disconnect();
    window.localStorage.setItem("autoConnect", "false");
  });
};

main();
