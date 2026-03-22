interface Payload {
  title: string;
  count: number;
}

function GenerateStatusMessage(payload: Payload) {
  if (payload.status === 3) {
    return `✅ Finished ${payload.title}`;
  }

  if (payload.status === 2) {
    return `▶️ Watching ${payload.title} (${payload.count})`;
  }

  if (payload.status === 4) {
    return `❌ Dropped ${payload.title}`;
  }

  return `📺 Updated ${payload.title}`;
}

export default GenerateStatusMessage;
