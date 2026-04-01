import useAuthStore from "@store/useAuthStore";

type ApiOptions = Omit<RequestInit, "method" | "body"> & {
  body?: any;
  auth?: boolean;
};

async function Api<T = any>(
  method: string,
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  let token: string | null = null;

  if (auth) {
    const { user } = useAuthStore.getState();
    if (user) {
      token = await user.getIdToken();
    }
  }

  const res = await fetch(url, {
    method,
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  if (res.status === 204) return null as T;

  return res.json();
}

export default Api;
