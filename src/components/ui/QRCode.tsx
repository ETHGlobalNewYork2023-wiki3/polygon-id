import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { CollectPolicyType, ContentFocus, ProfileOwnedByMe, useActiveProfile, useCreateComment } from "@lens-protocol/react-web";
import { Button } from "./button";
import {uploadJSON} from "@/lib/upload"
import { WIKI3_FOOTER, WIKI3_HEADER } from "@/lib/wiki3";

const QRCode = ({publicationId, identity, profile, veracity} : {profile: ProfileOwnedByMe}) => {
    const sessionId = useMemo(() => uuidv4(), []);
    const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
    } = useGenerateQrCode(sessionId, identity);


    const { data: verificationResponse } = useCheckForResponse(
        sessionId,
        !!qrCode
    );
   const { Canvas } = useQRCode();

   useEffect(() => {
        if (!!verificationResponse) {
            console.log("FIRE USECOMMENT")
            handleCreateVote()
        }},
        [verificationResponse]
   )

   const { execute: create, error, isPending } = useCreateComment({ publisher: profile, upload: uploadJSON })
   const handleCreateVote = async () => {

    const content = `${WIKI3_HEADER}${veracity},${identity}${WIKI3_FOOTER}`

    const response = await create({
        publicationId,
        content,
        contentFocus: ContentFocus.TEXT,
        locale: 'en',
        collect: {
          type: CollectPolicyType.NO_COLLECT
        },
      });
      console.log("DINGGINDSGN", response)
   }
   return (
    <div>
        {/* <Button onClick={() => handleCreateVote()}> Fire UseMakeComment </Button> */}
        {!loadingQrCode && <Canvas
        text={JSON.stringify(qrCode)}
        options={{
          width: 384,
        }} />}
        {!!verificationResponse ? (
            <span className="text-green-400">Verified</span>
          ) : (
            <span className="text-red-400">Not verified</span>
          )}
    </div>
   )
}

export default QRCode;