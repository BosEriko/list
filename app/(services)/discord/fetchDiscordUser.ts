type User = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: unknown | null;
  collectibles: unknown | null;
  display_name_styles: unknown | null;
  banner_color: string | null;
  clan: unknown | null;
  primary_guild: unknown | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
};

const fetchDiscordUser = async (token: string): Promise<User> => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  const data: User = await response.json();
  return data;
};

export default fetchDiscordUser;
