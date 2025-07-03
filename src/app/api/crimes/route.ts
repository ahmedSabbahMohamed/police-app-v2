import { db } from "@/drizzle/db";
import { CrimeTable, CriminalCrimeTable, CriminalTable } from "@/drizzle/schema";
import { createHandler } from "@/lib/api/handler";
import { validate } from "@/lib/api/validate";
import { AddCrimeWithCriminalsSchema } from "@/lib/validators";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const getCrimeHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const crimeId = searchParams.get("id");
  const nationalId = searchParams.get("nationalId");

  if (!nationalId) {
    return NextResponse.json({
      success: false,
      error: "National ID is required."
    }, { status: 400 });
  }

  // 1. Lookup criminal by nationalId
  const [criminal] = await db
    .select()
    .from(CriminalTable)
    .where(eq(CriminalTable.nationalId, nationalId));

  if (!criminal) {
    return NextResponse.json(
      {
        success: false,
        error: "Criminal not found.",
      },
      { status: 404 }
    );
  }

  // 2. If crimeId is provided, get specific crime for this criminal
  if (crimeId) {
    const [record] = await db
      .select({
        crime: CrimeTable,
        criminal: CriminalTable,
      })
      .from(CriminalCrimeTable)
      .where(
        and(
          eq(CriminalCrimeTable.crimeId, crimeId),
          eq(CriminalCrimeTable.criminalId, criminal.id)
        )
      )
      .innerJoin(CrimeTable, eq(CrimeTable.id, CriminalCrimeTable.crimeId))
      .innerJoin(CriminalTable, eq(CriminalTable.id, CriminalCrimeTable.criminalId));

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "No matching crime found for this criminal.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  }

  // 3. If no crimeId provided, get all crimes for this criminal
  const records = await db
    .select({
      crime: CrimeTable,
      criminal: CriminalTable,
    })
    .from(CriminalCrimeTable)
    .where(eq(CriminalCrimeTable.criminalId, criminal.id))
    .innerJoin(CrimeTable, eq(CrimeTable.id, CriminalCrimeTable.crimeId))
    .innerJoin(CriminalTable, eq(CriminalTable.id, CriminalCrimeTable.criminalId));

  return NextResponse.json(
    {
      success: true,
      data: records,
    },
    { status: 200 }
  );
}

const createCrimeHandler = async (req: NextRequest) => {
  const result = await validate(req, AddCrimeWithCriminalsSchema);
  if (!result.success) return result.response;

  const { crime, criminals } = result.data;
  const crimeId = uuid();

  // Insert crime record
  await db.insert(CrimeTable).values({
    id: crimeId,
    number: crime.number,
    year: crime.year,
    typeOfAccusation: crime.typeOfAccusation,
    lastBehaviors: crime.lastBehaviors,
  });

  console.log(crime, criminals, "from backend");

  for (const criminal of criminals) {
    // Check if criminal exists by nationalId
    let existing = await db.query.CriminalTable.findFirst({
      where: eq(CriminalTable.nationalId, criminal.nationalId),
    });

    let criminalId: string;

    if (!existing) {
      // Insert new criminal, generate new id
      criminalId = uuid();
      await db.insert(CriminalTable).values({
        id: criminalId,
        name: criminal.name,
        nationalId: criminal.nationalId,
        job: criminal.job,
        bod: criminal.bod,
        motherName: criminal.motherName,
        stageName: criminal.stageName,
        impersonation: criminal.impersonation,
        address: criminal.address ?? null,
      });
    } else {
      criminalId = existing.id;
    }

    // Link criminal to crime in pivot table
    await db.insert(CriminalCrimeTable).values({
      crimeId,
      criminalId,
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      message: "data stroed successfully!"
    }
  });
};

const updateCrimeHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const crimeId = searchParams.get("id");

  if (!crimeId) {
    return NextResponse.json({ success: false, error: "Crime ID is required" }, { status: 400 });
  }

  const body = await req.json();

  const updated = await db
    .update(CrimeTable)
    .set(body)
    .where(eq(CrimeTable.id, crimeId));

  if (!updated) {
    return NextResponse.json({ success: false, error: "Crime not found or not updated" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Crime updated successfully" });

};

const deleteCrimeFromCriminalHandler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const nationalId = searchParams.get("nationalId");
  const crimeId = searchParams.get("crimeId");

  if (!nationalId || !crimeId) {
    return NextResponse.json({
      success: false,
      error: "Both nationalId and crimeId are required"
    }, { status: 400 });
  }

  try {
    // Find the criminal by national ID
    const criminal = await db.query.CriminalTable.findFirst({
      where: eq(CriminalTable.nationalId, nationalId),
    });

    if (!criminal) {
      return NextResponse.json({
        success: false,
        error: "Criminal not found with the provided national ID"
      }, { status: 404 });
    }

    // Check if the crime exists
    const crime = await db.query.CrimeTable.findFirst({
      where: eq(CrimeTable.id, crimeId),
    });

    if (!crime) {
      return NextResponse.json({
        success: false,
        error: "Crime not found with the provided crime ID"
      }, { status: 404 });
    }

    // Check if the criminal is linked to this crime
    const criminalCrimeLink = await db.query.CriminalCrimeTable.findFirst({
      where: and(
        eq(CriminalCrimeTable.criminalId, criminal.id),
        eq(CriminalCrimeTable.crimeId, crimeId)
      ),
    });

    if (!criminalCrimeLink) {
      return NextResponse.json({
        success: false,
        error: "This criminal is not linked to the specified crime"
      }, { status: 404 });
    }

    // Remove the relationship between criminal and crime
    await db.delete(CriminalCrimeTable).where(
      and(
        eq(CriminalCrimeTable.criminalId, criminal.id),
        eq(CriminalCrimeTable.crimeId, crimeId)
      )
    );

    // Check if any other criminals have the same crime
    const otherCriminalsWithSameCrime = await db.query.CriminalCrimeTable.findMany({
      where: eq(CriminalCrimeTable.crimeId, crimeId),
    });

    // If no other criminals have this crime, delete it permanently
    if (otherCriminalsWithSameCrime.length === 0) {
      await db.delete(CrimeTable).where(eq(CrimeTable.id, crimeId));
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Crime removed from criminal successfully",
        crimeDeleted: otherCriminalsWithSameCrime.length === 0
      }
    });

  } catch (error) {
    console.error("Error deleting crime from criminal:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
};

export const POST = createHandler(createCrimeHandler);
export const PUT = createHandler(updateCrimeHandler);
export const DELETE = createHandler(deleteCrimeFromCriminalHandler);
export const GET = createHandler(getCrimeHandler);
