'use client'
import React, { useState } from "react";
import { ProfileId, PublicationId, useActiveProfile, useComments } from "@lens-protocol/react-web";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import QRCode from "@/components/ui/QRCode";
import EmojiSlider from "@/components/ui/emoji-slider";

// Fetch the QR code from the server with loading + error states thanks to TanStack Query.

const IDENTITIES = ['Physics', 'Chemistry', 'Biology']
const Comments = ({ postId }: { postId: PublicationId }) => {
  // Generate a unique session ID using uuid library.
  const { data: commentObjects, loading: isCommentsLoading, hasMore, next } = useComments({ commentsOf: postId });
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();
  // Used to render the QR code.

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const [selectedIdentity, setSelectedIdentity] = useState<string>("")
  const [isShowingQRCode, setIsShowingQRCode] = useState(false)
  const handleAddVote = () => {
    setIsShowingQRCode(true)

  }

  const handleChangeIdentity = (value: string) => {
    setIsShowingQRCode(false)
    setSelectedIdentity(value)
  }

  const comments = commentObjects ? commentObjects.map(({ metadata: { content } }) => content) : [];
  return (
    <div className=" py-4 m-4 shadow-lg w-[180px]">
      <Select defaultValue="comments">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="voting">Wiki3</SelectItem>
            <SelectItem value="comments">{`Comments (${comments.length})`}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className={'w-[180px]'}>
        <label>Vibe Check</label>
        <EmojiSlider />
        {/*<Slider defaultValue={[50]} max={100} step={1} />*/}
      </div>
      <Select defaultValue="identity"
              onValueChange={(value) => handleChangeIdentity(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="identity">Select your role?</SelectItem>
            {IDENTITIES.map(identity => (<SelectItem value={identity} key={identity}>{identity}</SelectItem>))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button disabled={selectedIdentity === ""} onClick={handleAddVote}> Add Vote </Button>
      {isShowingQRCode && <QRCode identity={selectedIdentity} />

      }
      {
        isCommentsLoading ?
          <p> Loading ...</p> :
          commentObjects?.map(({ id, metadata: { content } }) => <p key={id}>{content}</p>)
      }

    </div>
  )
}

export default Comments;
