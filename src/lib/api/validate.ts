import { ZodSchema } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function validate<T>(req: NextRequest, schema: ZodSchema<T>) {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          issues: result.error.flatten()
        },
        { status: 400 }
      )
    };
  }

  return {
    success: true as const,
    data: result.data
  };
}
