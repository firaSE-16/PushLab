import { NextResponse, type NextRequest } from 'next/server';
import { processMeeting } from '~/lib/assmblyAi';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meetingUrl, projectId, meetingId } = body;

    console.log('Received meetingUrl:', meetingUrl);

    const { summaries } = await processMeeting(meetingUrl);

    console.log('Extracted summaries:', summaries);

    if (summaries.length === 0) {
      console.warn('No summaries found in transcript.');
    } else {
      await db.issue.createMany({
        data: summaries.map(summary => ({
          start: summary.start,
          end: summary.end,
          gist: summary.gist,
          headline: summary.headline,
          summary: summary.summary,
          meetingId
        }))
      });
      console.log('Summaries inserted to DB');
    }

    // Use a fallback headline if missing
    const firstHeadline = summaries[0]?.headline ?? 'Untitled Meeting';

    await db.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'COMPLETED',
        name: firstHeadline,
      },
    });

    console.log('Meeting status updated');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
