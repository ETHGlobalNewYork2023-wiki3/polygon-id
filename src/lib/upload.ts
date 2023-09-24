import { Web3Storage } from 'web3.storage'


export async function uploadJSON( data : unknown) {
    const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFjNjgwRDQ5ZTI3RTVDNzQwQTFENDE3MTJmMDdmNDczMmIwOEJiYjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTU1NTUzOTgwMDgsIm5hbWUiOiJ3aWtpMyJ9.S6OTNsDnThIkCdK8srAuVF3aGjXY6UAkSmdtW4oeJP4'
})
    const rootCid = await client.put(makeFileObjects(data))
    const info = await client.status(rootCid)
    const url = `https://ipfs.io/ipfs/${info.cid}/vote.json`
    console.log(url)

    return url
}


function makeFileObjects (data) {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = data
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  
    const files = [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([blob], 'vote.json')
    ]
    return files
  }