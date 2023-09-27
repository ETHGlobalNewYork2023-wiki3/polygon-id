'use client'
import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProfileId, PublicationId, useActiveProfile, useComments } from "@lens-protocol/react-web";
import Vote from "./Vote";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import QRCode from "@/components/ui/QRCode";
import { WIKI3_FOOTER, WIKI3_HEADER, isCommentAVote } from "@/lib/wiki3";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";



// Fetch the QR code from the server with loading + error states thanks to TanStack Query.
const IDENTITIES = ['Physics', 'Chemistry', 'Biology']

const Comments = ({ postId } : { postId : PublicationId}) => {
  // Generate a unique session ID using uuid library.
    const {data: commentObjects, loading: isCommentsLoading, hasMore, next} = useComments({commentsOf: postId});
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();
  // Used to render the QR code.

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const [selectedIdentity, setSelectedIdentity] = useState<string>("")
  const [selectedView, setSelectedView] = useState<string>("comments")
  const [isShowingQRCode, setIsShowingQRCode] = useState(false)
  const [veracity, setVeracity] = useState(0.5)
  const handleAddVote = () => {
    setIsShowingQRCode(true) 

  }

  const handleChangeIdentity = (value : string) => {
    setIsShowingQRCode(false)
    setSelectedIdentity(value)
  }

  function extractSubstring(source: string, start: string, end: string): string | null {
    const startIdx = source.indexOf(start);
    const endIdx = source.indexOf(end, startIdx + start.length);
  
    if (startIdx === -1 || endIdx === -1) return null; // Return null if start or end string is not found
    
    return source.slice(startIdx + start.length, endIdx); // Extracting the substring between start and end strings
}

    const comments = commentObjects ? commentObjects.map(({ metadata: { content }}) => content ) : [];
    const votes = commentObjects?.filter(({ metadata: { content }}) => isCommentAVote(content));

    const displayedComments = (selectedView === "comments" ? commentObjects : votes)
    return (
        <div className="text-center overflow-y-auto overflow-x-auto px-8 py-4 m-8 shadow-lg w-[800px]">
          <Select defaultValue="comments" value={selectedView} onValueChange={(value) => setSelectedView(value)}>
            <SelectTrigger className="w-[180px]">
            <SelectValue/>
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                <SelectItem value="voting">{`Wiki3 (${votes?.length})`}</SelectItem>
                <SelectItem value="comments">{`Comments (${comments.length})`}</SelectItem>
            </SelectGroup>
            </SelectContent>
        </Select>
            {
              selectedView === "voting" &&
              <> 
              <Card className="mt-4 mb-4 w-[600px]">
                <CardHeader>
                  <CardTitle> Vote </CardTitle>
                  <CardDescription> Add your opinion about his article, and justify it with your credentials</CardDescription>
                </CardHeader>
                <CardContent className="grid place-content-center">
                  <div className="mb-4 flex">
                    <Slider value={[veracity]} onValueChange={(value) => setVeracity(value[0])} defaultValue={[0.5]} max={1} step={0.1} />
                    <label className="ml-4">{veracity}</label>
                  
                  </div>
                  <div className="flex">
                    <Select value={selectedIdentity} onValueChange={(value) => handleChangeIdentity(value)}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select your identity"/>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectGroup>
                              {IDENTITIES.map((identity, index)=>(<SelectItem key={index} value={identity} key={identity}>{identity}</SelectItem>))}
                          </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button disabled={selectedIdentity === ""} onClick={handleAddVote} className="ml-4"> Add Vote </Button>
                  </div>
                  <div className="mt-3">
                    {isShowingQRCode && 
                      <QRCode identity={selectedIdentity} profile={activeProfile} publicationId={postId} veracity={veracity}/>
                    }
                  </div>
                </CardContent>
              </Card>
               
              </>
            }
          <div>

          </div>
            { selectedView === "comments" &&
                isCommentsLoading ? 
                    <p> Loading ...</p> : 
                    displayedComments && displayedComments.length > 0 && <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">

                      {
                      displayedComments?.map((commentObject, index) => 
                    
                        <Vote key={`comment-${index}`} commentObject={commentObject}></Vote>)
                        }

                    </ScrollArea>}
                    
  

        </div>
    )
}

export default Comments;
