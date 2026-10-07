export const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const maskKey = (key: string) =>
  key.length <= 8 ? "••••" : `${key.slice(0, 4)}••••${key.slice(-4)}`;

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
