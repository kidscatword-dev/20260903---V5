import { describe, expect, it } from "vitest";
import { checkFirebaseConnection } from "./firebaseLeaderboard";

describe("Firebase Firestore 連線設定", () => {
  it("以 server secret 呼叫輕量 Firestore API，且不把憑證輸出到結果", async () => {
    const result = await checkFirebaseConnection();

    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      expect(result.configured).toBe(false);
      return;
    }

    expect(result.configured).toBe(true);
    expect(result.projectId).toBe("kids-cat-word");
    expect(result.firestoreReachable).toBe(true);
    expect(result).not.toHaveProperty("privateKey");
    expect(result).not.toHaveProperty("clientEmail");
  }, 30_000);
});

import { decodeServiceAccountJson } from "./firebaseLeaderboard";

describe("Firebase service account 格式", () => {
  it("接受完整 JSON 並核對 project_id", () => {
    const raw = JSON.stringify({
      type: "service_account",
      project_id: "kids-cat-word",
      client_email: "firebase-adminsdk-fbsvc@kids-cat-word.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\\nexample\\n-----END PRIVATE KEY-----\\n",
    });
    expect(decodeServiceAccountJson(raw, "kids-cat-word")).toMatchObject({ projectId: "kids-cat-word" });
    expect(decodeServiceAccountJson(raw, "another-project")).toBeNull();
  });

  it("拒絕不完整或不是 JSON 的內容", () => {
    expect(decodeServiceAccountJson("not-json", "kids-cat-word")).toBeNull();
    expect(decodeServiceAccountJson(JSON.stringify({ project_id: "kids-cat-word" }), "kids-cat-word")).toBeNull();
  });
});
