import { Client } from "@storacha/client";

async function test() {
  const client = new Client();
  try {
    const account = await client.login("singapoor124@gmail.com");
    console.log("Login successful:", account.did());
  } catch (e) {
    console.error("Login error:", e);
  }
}

test();
