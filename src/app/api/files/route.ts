// src/app/api/files/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dir = searchParams.get('dir');

  if (!dir) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const fileEntries = await fs.readdir(dir, { withFileTypes: true });
    const files = fileEntries.map(fileEntry => ({
      name: fileEntry.name,
      isDirectory: fileEntry.isDirectory(),
    }));
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
