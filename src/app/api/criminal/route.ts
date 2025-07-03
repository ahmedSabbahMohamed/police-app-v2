import { db } from "@/drizzle/db";
import { CrimeTable, CriminalCrimeTable, CriminalTable } from "@/drizzle/schema";
import { createHandler } from "@/lib/api/handler";
import { eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const createCrimeHandler = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const nationalId = searchParams.get("nationalId");
    
    if (!nationalId) {
        return NextResponse.json(
            {
                success: false,
                error: "National ID is required.",
            },
            { status: 400 }
        );
    }

    const body = await req.json();
    
    if (!body.year || !body.typeOfAccusation || !body.lastBehaviors) {
        return NextResponse.json({
            success: false,
            error: "Crime data is required: year, typeOfAccusation, lastBehaviors"
        }, { status: 400 });
    }

    const criminal = await db.query.CriminalTable.findFirst({
        where: eq(CriminalTable.nationalId, nationalId),
    });

    if (!criminal) {
        return NextResponse.json({
            success: false,
            error: "Criminal not found with the provided national ID"
        }, { status: 404 });
    }

    const crimeId = uuid();

    await db.insert(CrimeTable).values({
        id: crimeId,
        number: body.number,
        year: body.year,
        typeOfAccusation: body.typeOfAccusation,
        lastBehaviors: body.lastBehaviors,
    });

    await db.insert(CriminalCrimeTable).values({
        crimeId,
        criminalId: criminal.id,
    });

    return NextResponse.json({
        success: true,
        data: {
            message: "Crime added to criminal successfully!"
        }
    }, { status: 201 });
};

const getCriminalHandler = async (req: NextRequest) => {
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

  return NextResponse.json({
    success: true,
    data: criminals.map(criminal => ({
      id: criminal.id,
      name: criminal.name,
      nationalId: criminal.nationalId,
      stageName: criminal.stageName
    }))
  }, { status: 200 });
};

export const GET = createHandler(getCriminalHandler);
export const POST = createHandler(createCrimeHandler);