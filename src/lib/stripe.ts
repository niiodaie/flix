import { fetchFromApi } from "@/lib/api";

export const sendTip = async (creatorId: string, amount: number) => {
  return fetchFromApi("/tips", { method: "POST", body: JSON.stringify({ creatorId, amount }) });
};

export const getDashboardEarnings = async () => {
  return fetchFromApi("/dashboard");
};


