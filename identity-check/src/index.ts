import express, { Request, Response } from "npm:express@4.21.1";
import jwt from "npm:jsonwebtoken@9.0.2";
import {
  APP_URL,
  JWT_SECRET,
  WALLET_DID,
  WEBHOOK_SECRET,
} from "./constants.ts";
import {
  handleMessageReceived,
  handlePresentationReceived,
  sendUserRedirection,
} from "./helpers.ts";

const app = express();

app
  .use(express.static("public"))
  .use(express.json());

app.get("/secured", (_req: Request, res: Response) => {
  res.sendFile("secured.html", { root: "public" });
});

app.post("/workflow", async (req: Request, res: Response) => {
  if (
    req.body.payload?.walletDid !== WALLET_DID ||
    req.headers["x-connect-token"] !== WEBHOOK_SECRET
  ) {
    throw new Error("Unknown wallet or bad secret");
  }

  if (req.body.type === "MessageReceived") {
    await handleMessageReceived(req.body.payload);
  }

  if (req.body.type === "PresentationReceived") {
    const { firstName, lastName } = await handlePresentationReceived(
      req.body.payload,
    );

    const accessToken = jwt.sign(
      {
        firstName,
        lastName,
      },
      JWT_SECRET,
    );

    await sendUserRedirection(
      req.body.payload?.connectionId,
      `${APP_URL}/secured?accessToken=${accessToken}&firstName=${firstName.value}&lastName=${lastName.value}`,
    );
  }

  res.send("ok");
});

const port = Deno.env.get("PORT") || 5001;

app.listen(port, () => console.log(`Listening on ${port}`));
