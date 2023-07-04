import type { NextApiRequest, NextApiResponse } from "next";
import { Polybase } from "@polybase/client";
import { auth, resolver, loaders } from "@iden3/js-iden3-auth";
import getRawBody from "raw-body";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handleVerification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("HANDLE VERIFICATION");

  // get requestId from query params
  const { requestId } = req.query;

  // Read session ID from Polybase
  const db = new Polybase({
    defaultNamespace:
      "pk/0x2cd58ee4f9908a52b63882a622fb778e21b0b35a177ca5d3b7d9f0cd51eaaf4ec36f0c799e7002598fa2bf80590951a979164f67f0e1a1de5d1a29501681b056/test-polygon-id-app",
  });

  const record = await db
    .collection("Proofs")
    .record(requestId as string)
    .get();
  const { data } = record; // or const data = record.data

  const authRequest = JSON.parse(JSON.stringify(data));

  console.log(authRequest);

  // get JWZ token params from the post request
  const raw = await getRawBody(req);
  const tokenStr = raw.toString().trim();

  // The CredentialAtomicQuerySigValidator contract is used to verify any credential-related zk proof
  // generated by the user using the credentialAtomicQuerySigV2OnChain circuit.
  // https://0xpolygonid.github.io/tutorials/contracts/overview/#blockchain-addresses
  const mumbaiContractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";

  const ethStateResolver = new resolver.EthStateResolver(
    "https://mumbai.rpc.thirdweb.com",
    mumbaiContractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(
    path.join(process.cwd(), "keys")
  );

  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");

  // EXECUTE VERIFICATION
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);

  console.log("TOKEN STR:");
  console.log(tokenStr);

  console.log("AUTH REQUEST:");
  console.log(authRequest);

  try {
    const authResponse = await verifier.fullVerify(tokenStr, authRequest, {
      acceptedStateTransitionDelay: 5 * 60 * 1000, // up to a 5 minute delay accepted by the Verifier
    });

    console.log("AUTH RESPONSE:");
    console.log(authResponse);

    return res.status(200).send(authResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
