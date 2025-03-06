import { Liveblocks } from "@liveblocks/node";

const key = process.env.NEXT_LIVE_BLOCK_PRIVATE_KEY;
if (!key) {
  throw new Error("NEXT_LIVE_BLOCK_PRIVATE_KEY is not defined");
}

const liveblocks = new Liveblocks({
  secret: key,
});

export default liveblocks;
