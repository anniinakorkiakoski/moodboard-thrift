import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PinterestImage {
  url: string;
  title: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || (!url.includes('pinterest.com') && !url.includes('pin.it'))) {
      return new Response(
        JSON.stringify({ error: 'Invalid Pinterest URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Pinterest URL:', url);

    // If it's a shortened pin.it URL, follow the redirect to get the full URL
    let fullUrl = url;
    if (url.includes('pin.it')) {
      const redirectResponse = await fetch(url, { redirect: 'follow' });
      fullUrl = redirectResponse.url;
      console.log('Resolved pin.it URL to:', fullUrl);
    }

    // Try Pinterest's public oEmbed endpoint first
    const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(fullUrl)}`;
    const oembedResponse = await fetch(oembedUrl);
    
    if (oembedResponse.ok) {
      const data = await oembedResponse.json();
      console.log('oEmbed data:', data);
      
      const images: PinterestImage[] = [];
      
      // Extract image from oEmbed thumbnail
      if (data.thumbnail_url) {
        images.push({
          url: data.thumbnail_url.replace('236x', 'originals'), // Get higher quality
          title: data.title || 'Pinterest Image'
        });
      }
      
      return new Response(
        JSON.stringify({ images }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to fetch the page HTML
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pinterest page: ${response.statusText}`);
    }

    const html = await response.text();
    const images: PinterestImage[] = [];

    // Extract images from meta tags
    const metaImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const metaTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    
    if (metaImageMatch) {
      images.push({
        url: metaImageMatch[1].replace('236x', 'originals'),
        title: metaTitleMatch ? metaTitleMatch[1] : 'Pinterest Image'
      });
    }

    // Try to extract multiple images if it's a board
    const imageMatches = html.matchAll(/"url":"(https:\/\/i\.pinimg\.com\/[^"]+)"/g);
    for (const match of imageMatches) {
      const imageUrl = match[1].replace(/\\u002F/g, '/').replace('236x', 'originals');
      if (!images.find(img => img.url === imageUrl)) {
        images.push({
          url: imageUrl,
          title: 'Pinterest Image'
        });
      }
    }

    console.log(`Extracted ${images.length} images`);

    return new Response(
      JSON.stringify({ images: images.slice(0, 20) }), // Limit to 20 images
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting Pinterest images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
