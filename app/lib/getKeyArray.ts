export default function(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map(h => parseInt(h, 16)) as number[]);
}
