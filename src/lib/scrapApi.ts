// mora/src/lib/scrapApi.ts
import instance from "@/lib/api/axios";

export type ScrapItem = {
  petId: number;
  title: string;
  status: number;
  result: string;
  voteStartDate: string;
  voteEndDate: string;
};

export type ApiError = { status: number; message: string };

function normalizeAxiosError(e: any): ApiError {
  const status = e?.response?.status ?? e?.status ?? 0;
  const message =
    e?.response?.data?.message ??
    (typeof e?.response?.data === "string" ? e.response.data : null) ??
    e?.message ??
    "요청에 실패했습니다.";
  return { status, message };
}

// POST /petition/scrap/{id}
export async function postScrap(petitionId: number): Promise<void> {
  try {
    await instance.post(`/petition/scrap/${petitionId}`);
  } catch (e: any) {
    throw normalizeAxiosError(e);
  }
}

// GET /user/scrap
export async function getMyScraps(): Promise<ScrapItem[]> {
  try {
    const res = await instance.get<ScrapItem[]>(`/user/scrap`);
    return res.data;
  } catch (e: any) {
    throw normalizeAxiosError(e);
  }
}

// DELETE /user/scrap  body: { id: [petitionId, ...] }
export async function deleteScraps(petitionIds: number[]): Promise<void> {
  try {
    await instance.delete(`/user/scrap`, {
      data: { id: petitionIds }, // ✅ axios delete body
    });
  } catch (e: any) {
    throw normalizeAxiosError(e);
  }
}
