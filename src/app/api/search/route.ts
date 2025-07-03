import { db } from "@/drizzle/db";
import { CrimeTable, CriminalCrimeTable, CriminalTable } from "@/drizzle/schema";
import { createHandler } from "@/lib/api/handler";
import { eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const searchCriminalHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const nationalId = searchParams.get("nationalId");
  const name = searchParams.get("name");
  const stageName = searchParams.get("stageName");

  if (!nationalId && !name && !stageName) {
    return NextResponse.json({
      success: false,
      error: "Please provide at least one search parameter (nationalId, name, stageName)."
    }, { status: 400 });
  }

const conditions = [
  ...(name ? [like(CriminalTable.name, `%${name}%`)] : []),
  ...(nationalId ? [like(CriminalTable.nationalId, `%${nationalId}%`)] : []),
  ...(stageName ? [like(CriminalTable.stageName, `%${stageName}%`)] : []),
];

  const criminals = await db.query.CriminalTable.findMany({
    where: or(...conditions),
  });

    if (!criminals.length) {
    return NextResponse.json({ success: false, error: "No matching criminals found" }, { status: 404 });
  }

  const result = await Promise.all(
    criminals.map(async (criminal) => {
      const links = await db
        .select()
        .from(CriminalCrimeTable)
        .where(eq(CriminalCrimeTable.criminalId, criminal.id));

      const crimeIds = links.map((link) => link.crimeId);

      const crimes = crimeIds.length
        ? await db
            .select()
            .from(CrimeTable)
            .where(or(...crimeIds.map((id) => eq(CrimeTable.id, id))))
        : [];
    
            return {
        criminal,
        crimes,
      };
    })
  );

    return NextResponse.json({
    success: true,
    data: result,
  });

};


export const GET = createHandler(searchCriminalHandler);