import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
 const rapidApiKey = process.env.RAPIDAPI_KEY;

 if (!rapidApiKey) {
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

 const profileUrl = url.startsWith('http') ? url : `https://${url}`;

 const res = await fetch(
 `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=${encodeURIComponent(profileUrl)}`,
 {
 headers: {
 'x-rapidapi-key': rapidApiKey,
 'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
 },
 }
 );

 if (!res.ok) {
 if (res.status === 404) {
 return NextResponse.json({ error: "couldn't find that profile. double-check the url?" }, { status: 404 });
 }
 if (res.status === 429) {
 return NextResponse.json({ error: 'rate limit hit. try again in a moment.' }, { status: 429 });
 }
 return NextResponse.json({ error: 'failed to fetch profile. try pasting manually below.' }, { status: 500 });
 }

 const data = await res.json();

 const name = data.full_name || data.firstName && `${data.firstName} ${data.lastName || ''}`.trim() || '';
 const headline = data.headline || data.occupation || '';
 const about = data.summary || data.about || '';
 const location = data.location || data.city || '';

 const recentExp = (data.experience || data.experiences || [])
 .slice(0, 2)
 .map((e: { title?: string; company?: string; company_name?: string; description?: string }) =>
 [
 e.title,
 (e.company || e.company_name) ? `@ ${e.company || e.company_name}` : '',
 e.description ? ` ${e.description.slice(0, 150)}` : '',
 ].filter(Boolean).join(' ')
 )
 .join('\n');

 const recentActivity = (data.activities || data.posts || [])
 .slice(0, 3)
 .map((a: { title?: string; text?: string }) => a.title || a.text)
 .filter(Boolean)
 .join('\n');

 const profileParts = [
 name && `Name: ${name}`,
 headline && `Headline: ${headline}`,
 location && `Location: ${location}`,
 about && `About:\n${about}`,
 recentExp && `Recent experience:\n${recentExp}`,
 recentActivity && `Recent posts/activity:\n${recentActivity}`,
 ].filter(Boolean).join('\n\n');

 return NextResponse.json({
 rawProfile: profileParts,
 preview: {
 name,
 headline,
 about: about ? about.slice(0, 200) + (about.length > 200 ? '...' : '') : '',
 location,
 profilePicUrl: data.profile_pic_url || data.photo_url || null,
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
