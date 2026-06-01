import { NextRequest, NextResponse } from "next/server";
import { buildPlaceContent } from "@/lib/wikidata";
import { resolveEntityBySlugOrQid } from "@/lib/entityResolver";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wikidataId: string }> }
): Promise<NextResponse> {
  const { wikidataId } = await params;

  // Basic Q-ID validation — must be Q followed by digits
  if (!/^Q\d+$/.test(wikidataId)) {
    return NextResponse.json(
      { error: "Invalid Wikidata ID" },
      { status: 400 }
    );
  }

  try {
    const resolution = await resolveEntityBySlugOrQid(wikidataId, "place");
    const resolved = resolution.resolved;
    if (!resolved) {
      return NextResponse.json(
        { error: "No verified article for this entity" },
        { status: 404 }
      );
    }

    const content = await buildPlaceContent(resolved.wikidataId, resolved.canonicalName);

    return NextResponse.json(
      { ...content, slug: resolved.slug, resolutionMethod: resolved.method },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (err) {
    console.error(`[place] Failed to build content for ${wikidataId}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch place content" },
      { status: 500 }
    );
  }
}
