import { getPayload } from 'payload';
import config from '@/payload.config';

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function getPayloadClient() {
  if (cachedPayload) {
    return cachedPayload;
  }

  const payloadConfig = await config;
  cachedPayload = await getPayload({ config: payloadConfig });

  return cachedPayload;
}
