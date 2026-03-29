import { NextRequest, NextResponse } from "next/server";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import { auth } from "@/lib/auth";
import path from "node:path";
import { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";

const uploadDir = path.resolve(process.env.UPLOAD_DIR || "./uploads");

const tusServer = new Server({
  path: "/api/upload",
  datastore: new FileStore({ directory: uploadDir }),
  maxSize: (Number(process.env.MAX_UPLOAD_SIZE_GB) || 2) * 1024 * 1024 * 1024,
  generateUrl(_req, { proto, host, path, id }) {
    return `${proto}://${host}${path}/${id}`;
  },
});

function toNodeRequest(request: NextRequest): IncomingMessage {
  const readable = Readable.from(
    request.body ? (async function* () {
      const reader = request.body!.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    })() : []
  );

  const req = Object.assign(readable, {
    method: request.method,
    url: request.nextUrl.pathname + request.nextUrl.search,
    headers: Object.fromEntries(request.headers.entries()),
  }) as unknown as IncomingMessage;

  return req;
}

async function handleTus(request: NextRequest) {
  if (request.method !== "OPTIONS") {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return new Promise<NextResponse>((resolve) => {
    const req = toNodeRequest(request);

    const chunks: Buffer[] = [];
    const headers: Record<string, string> = {};
    let statusCode = 200;

    const res = {
      setHeader(name: string, value: string) {
        headers[name.toLowerCase()] = value;
        return this;
      },
      getHeader(name: string) {
        return headers[name.toLowerCase()];
      },
      writeHead(code: number, h?: Record<string, string>) {
        statusCode = code;
        if (h) Object.entries(h).forEach(([k, v]) => { headers[k.toLowerCase()] = v; });
        return this;
      },
      write(chunk: Buffer | string) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      },
      end(chunk?: Buffer | string) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const body = chunks.length > 0 ? Buffer.concat(chunks) : null;
        const response = new NextResponse(body, {
          status: statusCode,
          headers,
        });
        resolve(response);
      },
      hasHeader(name: string) {
        return name.toLowerCase() in headers;
      },
      removeHeader(name: string) {
        delete headers[name.toLowerCase()];
      },
    } as unknown as ServerResponse;

    tusServer.handle(req, res);
  });
}

export async function POST(request: NextRequest) {
  return handleTus(request);
}

export async function PATCH(request: NextRequest) {
  return handleTus(request);
}

export async function HEAD(request: NextRequest) {
  return handleTus(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleTus(request);
}

export async function DELETE(request: NextRequest) {
  return handleTus(request);
}
