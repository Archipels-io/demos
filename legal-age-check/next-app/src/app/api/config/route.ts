export async function GET() {
  return Response.json({
    invitationLink: process.env.NEXT_PUBLIC_INVITATION_LINK,
  });
}

