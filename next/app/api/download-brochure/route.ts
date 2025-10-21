import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'brochure.pdf');
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Pito-App-Brochure.pdf"',
      },
    });
  } catch (error) {
    console.error('Error downloading brochure:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
