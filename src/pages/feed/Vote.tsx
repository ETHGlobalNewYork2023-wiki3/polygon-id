import collectAggregateDataFromVote, { isCommentAVote } from "@/lib/wiki3";
import { Card } from "@/components/ui/card";

const Vote = ({ commentObject }) => {
    const {id, metadata: { content }} = commentObject
    const isVote = isCommentAVote(content)
    const [veracity, identities] = collectAggregateDataFromVote(content)
    return (
        <div> 
            {isVote? 
                <Card className="mb-2">
                    <p className="text-base"> Veracity: {veracity} </p>
                    {identities.map((identity, index)=>
                    <span key={identity + index} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                        {identity}
                        </span>
                    )}
                    
                </Card>
            
            : <Card> Comment: {content} </Card>}</div>
    )
}

export default Vote;