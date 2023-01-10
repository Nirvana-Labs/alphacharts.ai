import React from "react";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import useSWR from "swr";
import NftImage from "../../components/Web3/NftImage";
import { getEllipsisTxt } from "../../utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TxnDetails() {
  const router = useRouter();
  const { txnHash } = router.query;
  const { data, error } = useSWR(
    `https://api.nirvanalabs.xyz/txn?hash=${txnHash}`,
    fetcher
  );
  if (error) return "An error has occurred.";
  if (!data)
    return (
      <div className="flex h-screen w-full justify-center items-center text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  console.log(data);
  return (
    <div>
      <Header />
      <main className="p-5">
        <div className="bg-black bg-opacity-50 p-2 sm:p-10 mx-auto max-w-4xl rounded-xl">
          <div>
            <h1 className="text-3xl font-bold">Transaction Details</h1>

            <Link href={`https://etherscan.io/tx/${txnHash}`}>
              <button className="bg-blue-700 px-3 py-2 shadow-xl hover:shadow-none rounded-lg hover:bg-opacity-70 mb-2 text-sm">
                Etherscan
              </button>
            </Link>
            <br />
            <span className="text-sm break-words">
              Txn Hash: {getEllipsisTxt(txnHash, 18)}
            </span>
          </div>
          {data.map((txn, index) => {
            return (
              <div key={index} className="bg-gray-800 rounded-xl my-4">
                <div className="flex-wrap rounded-lg p-2 bg-opacity-10">
                  <span className="text-sm break-words">
                    Contract Address: {getEllipsisTxt(txn.address, 10)}
                  </span>
                  <div>To: {getEllipsisTxt(txn.to, 6)}</div>
                  <div>From: {getEllipsisTxt(txn.from, 6)}</div>
                </div>

                <div className="bg-slate-900 p-4 my-2 rounded shadow-lg text-gray-300">
                  <div>{txn.name}</div>

                  {txn.type == "ERC721" && <div>Token ID: {txn.value}</div>}

                  <div className="text-sm">
                    Timestamp: {Date(txn.timestamp)}
                  </div>
                  <br />
                  <div>From: {getEllipsisTxt(txn.from, 8)}</div>
                  <div>To: {getEllipsisTxt(txn.to, 8)}</div>
                  <div className="flex-col">
                    <div className=" text-md">{txn.symbol}</div>
                  </div>
                  <div className=" flex justify-between items-end">
                    <div>
                      <div
                        className={classNames(
                          txn.type == "ERC721"
                            ? "text-xxs mt-2 border border-sky-400 w-fit px-1 rounded-md"
                            : "text-xxs mt-2 border border-yellow-400 w-fit px-1 rounded-md"
                        )}
                      >
                        {txn.type}
                      </div>
                      <div className="text-xxs bg-black p-1 mt-2 w-fit rounded">
                        Block #: {txn.block_number}
                      </div>
                    </div>
                    <div>
                      {txn.type == "ERC20" ? (
                        <span className="text-white font-bold text-lg">
                          {ethers.utils.formatUnits(txn.value)} {txn.symbol}
                        </span>
                      ) : (
                        <div>
                          <span className="text-white text-lg">
                            {ethers.utils.formatEther(txn.value)} {txn.symbol}
                          </span>
                          <br />
                          <span className="text-white font-bold text-lg">
                            Token # {txn.value.substring(0, 6)}
                          </span>
                        </div>
                      )}

                      <div>
                        Gas:{" "}
                        {ethers.utils
                          .formatUnits(
                            String(
                              txn.transaction_gas_used *
                                txn.transaction_gas_price
                            )
                          )
                          .substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
