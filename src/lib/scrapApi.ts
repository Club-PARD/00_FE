export type ScrapItem = {
    petId: number;
    title: string;
    status: number;      
    result: string;     
    voteStartDate: string;
    voteEndDate: string;
  };
  
  type ApiError = { status: number; message: string };
  
  async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "include", 
    });
  
    if (!res.ok) {
      let msg = "요청에 실패했습니다.";
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {}
      const err: ApiError = { status: res.status, message: msg };
      throw err;
    }
  

    const text = await res.text();
    return (text ? JSON.parse(text) : (undefined as unknown as T));
  }
  
  export async function postScrap(petitionId: number) {

    return request<void>(`/petition/scrap/${petitionId}`, { method: "POST" });
  }
  
  export async function getMyScraps() {
    return request<ScrapItem[]>(`/user/scrap`, { method: "GET" });
  }
  
  export async function deleteScraps(petitionIds: number[]) {
    return request<void>(`/user/scrap`, {
      method: "DELETE",
      body: JSON.stringify({ id: petitionIds }),
    });
  }
  