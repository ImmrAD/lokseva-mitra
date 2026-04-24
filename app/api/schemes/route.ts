import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OGD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OGD_API_KEY' }, { status: 500 });
  }

  const searchUrls = [
    `https://api.data.gov.in/lists/datasets?api-key=${apiKey}&format=json&filters[title]=scheme&limit=120`,
    `https://api.data.gov.in/lists/datasets?api-key=${apiKey}&format=json&filters[title]=schemes&limit=120`,
    `https://api.data.gov.in/lists/datasets?api-key=${apiKey}&format=json&filters[tags]=scheme&limit=120`,
    `https://api.data.gov.in/lists/datasets?api-key=${apiKey}&format=json&filters[description]=scheme&limit=120`,
    `https://api.data.gov.in/lists/datasets?api-key=${apiKey}&format=json&limit=120`,
  ];

  const fetchDatasets = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const body = await response.text();

    if (!response.ok) {
      throw new Error(`OGD request failed (${response.status}): ${body}`);
    }

    if (!contentType.includes('application/json')) {
      throw new Error(`OGD returned non-JSON response (${response.status}): ${body.substring(0, 200)}`);
    }

    try {
      const json = JSON.parse(body);
      return Array.isArray(json.datasets) ? json.datasets : [];
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError}. Response body: ${body.substring(0, 200)}`);
    }
  };

  try {
    let datasets: any[] = [];
    let lastError: Error | null = null;

    for (const url of searchUrls) {
      try {
        datasets = await fetchDatasets(url);
        if (datasets.length > 0) break;
      } catch (err) {
        lastError = err as Error;
        console.warn('Scheme discovery query failed:', err);
      }
    }

    if (datasets.length === 0) {
      console.error('Scheme discovery failed for all query variants.', lastError);
      const fallback = [
        {
          id: 'pm-kisan',
          name: 'PM Kisan Samman Nidhi',
          description: 'Direct income support to farmers from the Ministry of Agriculture.',
          sector: 'Agriculture',
          organization: 'Ministry of Agriculture & Farmers Welfare',
          link: 'https://data.gov.in/',
          tags: ['scheme', 'agriculture'],
          updated: null,
        },
        {
          id: 'ujjwala',
          name: 'Pradhan Mantri Ujjwala Yojana',
          description: 'Free LPG connections for women from poor households.',
          sector: 'Energy',
          organization: 'Ministry of Petroleum & Natural Gas',
          link: 'https://data.gov.in/',
          tags: ['scheme', 'energy'],
          updated: null,
        },
      ];
      return NextResponse.json({ schemes: fallback, sectors: ['All', 'Agriculture', 'Energy'], count: fallback.length, fallback: true });
    }

    const schemes: Array<{
      id: string;
      name: string;
      description: string;
      sector: string;
      organization: string;
      link: string;
      tags: string[];
      updated: string | null;
    }> = datasets.map((data: any, index: number) => {
      const sector = Array.isArray(data.sector) && data.sector.length > 0 ? data.sector[0] : 'General';
      const org = Array.isArray(data.org) && data.org.length > 0 ? data.org[0] : 'Government of India';
      const title = data.title || data.name || 'Government Scheme';
      const description = data.description || 'Official scheme dataset from data.gov.in.';
      const link = data.id ? `https://data.gov.in/dataset/${data.id}` : 'https://data.gov.in/';
      return {
        id: data.id || `scheme-${index}`,
        name: title,
        description,
        sector,
        organization: org,
        link,
        tags: Array.isArray(data.tags) ? data.tags : [],
        updated: data.last_updated_date || data.last_updated || data.modified || null,
      };
    });

    const sectors = Array.from(new Set(schemes.map((scheme) => scheme.sector))).sort();

    return NextResponse.json({ schemes, sectors, count: schemes.length });
  } catch (error) {
    console.error('Scheme discovery fetch failed:', error);
    return NextResponse.json({ error: 'Unable to connect to data.gov.in' }, { status: 502 });
  }
}