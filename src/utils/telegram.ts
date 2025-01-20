export function getTelegramInviteLink(
  botUserName: string,
  appName: string,
  referrerId: string,
) {
  return `https://t.me/${botUserName}/${appName}?startapp=${referrerId}`;
}

export function getUserTelegramId(telegramInitData: string): string | null {
  try {
    // Decode the URL-encoded string
    const decodedInitData = decodeURIComponent(telegramInitData);

    // Parse the query string
    const params = new URLSearchParams(decodedInitData);

    // Get the 'user' parameter and parse it as JSON
    const userString = params.get('user');
    if (!userString) {
      return null;
    }

    const user = JSON.parse(userString);
    return user.id?.toString() || null;
  } catch (error) {
    console.error('Error parsing initData:', error);
    return null;
  }
}
