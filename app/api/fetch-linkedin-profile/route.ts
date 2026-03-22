import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const proxycurlKey = process.env.PROXYCURL_API_KEY;

  if (!proxycurlKey) {
    return NextResponse.json(
      { error: 'LinkedIn fetching not configured yet. Paste their profile info manually below.' },
      { status: 503 }
    );
  }

  try {
    const { url } = await request.json();

    if (!url || !url.includes('linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/username)' },
        { status: 400 }
      );
    }

    // Normalize URL
    const profileUrl = url.startsWith('http') ? url : `https://${url}`;

    const res = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(profileUrl)}&fallback_to_cache=on-error&use_cache=if-present&skills=include&inferred_salary=exclude&personal_email=exclude&personal_contact_number=exclude&twitter_profile_id=exclude&facebook_profile_id=exclude&github_profile_id=exclude&extra=exclude`,
      {
        headers: { Authorization: `Bearer ${proxycurlKey}` },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 404) {
        return NextResponse.json({ error: "couldn't find that profile. double-check the url?" }, { status: 404 });
      }
      if (res.status === 429) {
        return NextResponse.json({ error: 'rate limit hit. try again in a moment.' }, { status: 429 });
      }
      return NextResponse.json({ error: err.description || 'failed to fetch profile. try pasting manually.' }, { status: 500 });
    }

    const data = await res.json();

    // Build a clean profile text that Claude can work with
    const name = data.full_name || '';
    const headline = data.headline || data.occupation || '';
    const about = data.summary || '';

    // Grab top 2 recent experiences
    const recentExp = (data.experiences || [])
      .slice(0, 2)
      .map((e: { title?: string; company?: string; description?: string }) =>
        [e.title, e.company ? `@ ${e.company}` : '', e.description ? `— ${e.description.slice(0, 150)}` : '']
          .filter(Boolean).join(' ')
      )
      .join('\n');

    // Grab recent activities/posts
    const recentActivity = (data.activities || [])
      .slice(0, 3)
      .map((a: { title?: string }) => a.title)
      .filter(Boolean)
      .join('\n');

    // Compose the raw profile text to feed into message generation
    const profileParts = [
      name && `Name: ${name}`,
      headline && `Headline: ${headline}`,
      about && `About:\n${about}`,
      recentExp && `Recent experience:\n${recentExp}`,
      recentActivity && `Recent posts/activity:\n${recentActivity}`,
    ].filter(Boolean).join('\n\n');

    return NextResponse.json({
      name,
      headline,
      about,
      rawProfile: profileParts,
      // For display in the preview card
      preview: {
        name,
        headline,
        about: about ? about.slice(0, 200) + (about.length > 200 ? '...' : '') : '',
        location: data.city ? `${data.city}${data.country ? ', ' + data.country : ''}` : '',
        connections: data.connections,
        profilePicUrl: data.profile_pic_url || null,
      },
    });
  } catch (error) {
    console.error('LinkedIn fetch error:', error);
    return NextResponse.json(
      { error: 'something went wrong fetching the profile. try pasting manually.' },
      { status: 500 }
    );
  }
}
