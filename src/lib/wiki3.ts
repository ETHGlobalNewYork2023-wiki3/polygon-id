
export const WIKI3_HEADER = "___wiki3\n"
export const WIKI3_FOOTER = "\nwiki3___"

import { Comment } from "@lens-protocol/react-web"


export const isCommentAVote = (comment : string) => {
    return comment.length >= WIKI3_HEADER.length + WIKI3_FOOTER.length &&
        comment.startsWith(WIKI3_HEADER) && comment.endsWith(WIKI3_FOOTER)
}

const collectAggregateDataFromVote = (content : string) : [number, string[]] => {
    if (!isCommentAVote) {
        throw new Error("collectIdentitiesFromVote received a non vote comment")
    }
    const strippedContent = content.replace(WIKI3_HEADER, "").replace(WIKI3_FOOTER, "")
    const tokens = strippedContent.split(",")
    const veracity = parseFloat(tokens[0])
    const identities = tokens.splice(1, tokens.length)

    return [veracity, identities]        
}

export default collectAggregateDataFromVote;