export const generateMockAvatar = (username: string) => {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    username
  )}`;
};