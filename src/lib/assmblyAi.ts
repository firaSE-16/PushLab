import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!
});

function msToTime(ms: number) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const processMeeting = async (meetingUrl: string) => {
  // Create transcript job
  let transcript = await client.transcripts.create({
    audio_url: meetingUrl,
    auto_chapters: true
  });

  const maxPollingAttempts = 20; // max 20 * 5s = 100 seconds
  let attempts = 0;

  // Poll until status is 'completed' or 'error'
  while (transcript.status !== 'completed' && transcript.status !== 'error') {
    if (attempts >= maxPollingAttempts) {
      throw new Error('Transcription polling timed out.');
    }
    console.log(`Polling transcription status: ${transcript.status} (attempt ${attempts + 1})`);
    await new Promise((r) => setTimeout(r, 5000)); // wait 5 seconds
    transcript = await client.transcripts.get(transcript.id);
    attempts++;
  }

  if (transcript.status === 'error') {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  console.log('Transcription completed:', transcript);

  if (!transcript.text) {
    throw new Error('No transcript text found');
  }

  // Map chapters to summaries, if available
  const summaries = transcript.chapters?.map(chapter => ({
    start: msToTime(chapter.start),
    end: msToTime(chapter.end),
    gist: chapter.gist,
    headline: chapter.headline,
    summary: chapter.summary
  })) || [];

  return { summaries };
};
