import { NextRequest, NextResponse } from "next/server";

type HandlerFunction = (req: NextRequest) => Promise<NextResponse>;

type Options = {
  onError?: (error: unknown, req: NextRequest) => void;
  debug?: boolean;
};

export function createHandler(handler: HandlerFunction, options?: Options) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      if (options?.onError) {
        options.onError(error, req);
      } else {
        console.error("Unhandled API error:", error);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error:
            options?.debug && error instanceof Error
              ? error.message
              : "Something went wrong"
        },
        { status: 500 }
      );
    }
  };
}
