import { NextRequest, NextResponse } from 'next/server';
import {
  APP_URL,
  WALLET_DID,
  WEBHOOK_SECRET,
} from '@/lib/constants';
import {
  handleMessageReceived,
  handlePresentationReceived,
  sendUserRedirection,
} from '@/lib/helpers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (
    body.payload?.walletDid !== WALLET_DID ||
    request.headers.get("x-connect-token") !== WEBHOOK_SECRET
  ) {
    console.error("Unknown wallet or bad secret");
    return NextResponse.json({ error: "Unknown wallet or bad secret" }, { status: 401 });
  }

  if (body.type === "MessageReceived") {
    await handleMessageReceived(body.payload);
    return NextResponse.json({ status: "ok" });
  }

  if (body.type === "PresentationReceived") {
    const { over18 } = await handlePresentationReceived(body.payload);

    if (over18 !== "true" && over18 !== true) {
      await sendUserRedirection(
        body.payload?.connectionId,
        `${APP_URL}?error=underage`,
      );
      return NextResponse.json({ status: "ok" });
    }

    await sendUserRedirection(
      body.payload?.connectionId,
      `${APP_URL}/secured`,
    );
    return NextResponse.json({ status: "ok" });
  }

  return NextResponse.json({ status: "ok" });
} 
