const defaultSettings = [
  { name: 'connections', isEnabled: false },
  { name: 'email', isEnabled: true },
  { name: 'guilds.join', isEnabled: false },
  { name: 'guilds', isEnabled: false },
  { name: 'identify', isEnabled: true },
  { name: 'messages.read', isEnabled: false },
];

function authentication_login(settings = defaultSettings) {
  const scopes = settings
    .filter(setting => setting.isEnabled)
    .map(setting => setting.name)
    .join(' ');

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    response_type: 'code',
    scope: scopes,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export default authentication_login;
