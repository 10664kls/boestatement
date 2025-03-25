interface StoredItem<T> {
  value: T;
  expiry: number; 
}

export const setWithExpiration = <T>(key: string, value: T, ttl: number): void => {
  const now = new Date();
  const item: StoredItem<T> = {
    value,
    expiry: now.getTime() + ttl, 
  };
  localStorage.setItem(key, JSON.stringify(item));
};


export const getWithExpiration = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null; 

  const item: StoredItem<T> = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const getTokenFromLocalStorage = (key : string): string | null  => {
  const token = localStorage.getItem(key)
  if (token) return token
  return null
}

export const setTokensToLocalStorage = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
}