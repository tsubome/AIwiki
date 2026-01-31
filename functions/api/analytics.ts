// Cloudflare Analytics API endpoint
// Fetches analytics data from Cloudflare GraphQL API

interface Env {
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_ZONE_ID: string
}

interface GraphQLResponse {
  data?: {
    viewer?: {
      zones?: Array<{
        httpRequests1dGroups?: Array<{
          dimensions: { date?: string; clientCountryName?: string }
          sum: { pageViews: number; requests: number }
          uniq: { uniques: number }
        }>
        httpRequests1hGroups?: Array<{
          dimensions: { datetime?: string }
          sum: { pageViews: number; requests: number }
          uniq: { uniques: number }
        }>
        httpRequestsAdaptiveGroups?: Array<{
          dimensions: { clientRequestPath?: string }
          sum: { pageViews: number; requests: number }
        }>
      }>
    }
  }
  errors?: Array<{ message: string }>
}

async function fetchCloudflareAnalytics(
  query: string,
  variables: Record<string, string>,
  token: string
): Promise<GraphQLResponse> {
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL API error: ${response.statusText}`)
  }

  return response.json()
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    const token = context.env.CLOUDFLARE_API_TOKEN
    const zoneId = context.env.CLOUDFLARE_ZONE_ID

    if (!token || !zoneId) {
      return new Response(
        JSON.stringify({ error: 'Missing API credentials' }),
        { status: 500, headers: corsHeaders }
      )
    }

    const url = new URL(context.request.url)
    const metric = url.searchParams.get('metric') || 'summary'
    const days = parseInt(url.searchParams.get('days') || '30')

    const dateStart = new Date()
    dateStart.setDate(dateStart.getDate() - days)
    const dateStartStr = dateStart.toISOString().split('T')[0]

    let query = ''
    const variables: Record<string, string> = {
      zoneTag: zoneId,
      dateStart: dateStartStr,
    }

    if (metric === 'hourly') {
      // Hourly page views for the last 24 hours
      const dateStart24h = new Date()
      dateStart24h.setHours(dateStart24h.getHours() - 24)
      variables.dateStart = dateStart24h.toISOString()

      query = `
        query GetHourlyAnalytics($zoneTag: String!, $dateStart: String!) {
          viewer {
            zones(filter: {zoneTag: $zoneTag}) {
              httpRequests1hGroups(
                filter: {datetime_geq: $dateStart}
                orderBy: [datetime_ASC]
                limit: 24
              ) {
                dimensions { datetime }
                sum { pageViews requests }
                uniq { uniques }
              }
            }
          }
        }
      `
    } else if (metric === 'summary' || metric === 'daily') {
      // Daily page views and unique visitors
      query = `
        query GetDailyAnalytics($zoneTag: String!, $dateStart: String!) {
          viewer {
            zones(filter: {zoneTag: $zoneTag}) {
              httpRequests1dGroups(
                filter: {date_geq: $dateStart}
                orderBy: [date_ASC]
                limit: 365
              ) {
                dimensions { date }
                sum { pageViews requests }
                uniq { uniques }
              }
            }
          }
        }
      `
    } else if (metric === 'topPages') {
      // Top pages by page views
      query = `
        query GetTopPages($zoneTag: String!, $dateStart: String!) {
          viewer {
            zones(filter: {zoneTag: $zoneTag}) {
              httpRequests1dGroups(
                filter: {date_geq: $dateStart}
                limit: 1000
              ) {
                sum { pageViews requests }
                uniq { uniques }
              }
            }
          }
        }
      `
    } else if (metric === 'countries') {
      // Traffic by country
      query = `
        query GetTrafficByCountry($zoneTag: String!, $dateStart: String!) {
          viewer {
            zones(filter: {zoneTag: $zoneTag}) {
              httpRequests1dGroups(
                filter: {date_geq: $dateStart}
                limit: 100
              ) {
                dimensions { clientCountryName }
                sum { pageViews requests }
                uniq { uniques }
              }
            }
          }
        }
      `
    }

    const result = await fetchCloudflareAnalytics(query, variables, token)

    if (result.errors && result.errors.length > 0) {
      return new Response(
        JSON.stringify({ error: result.errors[0].message }),
        { status: 400, headers: corsHeaders }
      )
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: corsHeaders }
    )
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
