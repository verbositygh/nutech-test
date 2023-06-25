import * as jose from 'jose';
import getKeyArray from "../lib/getKeyArray";

export default async (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ');
  if (!token || token.length > 2 || token[0] !== 'Bearer') {
    throw new Error()
  }
  return await jose.jwtVerify(token[1], getKeyArray(process.env.JWT_KEY as unknown as string));
}
