interface PostQuery {
  query: string;
  onData: (chunk: string) => void;
  onError: (error: Error) => void;
}

export async function postQuery({ query, onData, onError }: PostQuery) {
  try {
    const res = await fetch('http://localhost:4000/api/chat/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok || !res.body) {
      throw new Error('Connection failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      for (const line of decoder.decode(value).split('\n')) {
        if (line.startsWith('data:')) {
          onData(JSON.parse(line.slice(5)));
        }

        if (line.startsWith('error:')) {
          onError(new Error(JSON.parse(line.slice(6))));
          return;
        }
      }
    }
  } catch (err) {
    onError(err as Error);
  }
}
