import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { url?: string };
    const submittedUrl = body.url?.trim();

    if (!submittedUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = submittedUrl;
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://${targetUrl}`;
    }

    let seoScore = 0;
    let extractedData: Record<string, string | number> = {};

    try {
      const response = await fetch(targetUrl);
      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $("title").text();
      const metaDesc = $("meta[name='description']").attr("content") || "";
      const h1Count = $("h1").length;

      if (title.length > 10) seoScore += 40;
      if (metaDesc.length > 50) seoScore += 40;
      if (h1Count > 0) seoScore += 20;

      extractedData = { title, metaDesc, h1Count };
    } catch {
      return NextResponse.json(
        { error: "Failed to scan this URL." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedAudit = await prisma.auditHistory.create({
      data: {
        url: targetUrl,
        seoScore,
        keywordData: extractedData,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: savedAudit });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
