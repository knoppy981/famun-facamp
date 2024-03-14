// download file buffer
import { LoaderFunctionArgs, createReadableStreamFromReadable, json } from '@remix-run/node';
import { Readable } from 'node:stream';
import { getFileBuffer } from '~/models/file.server';
import { requireAdminId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)

  const url = new URL(request.url);
  const fileId = url.searchParams.get("fileId");
  let file

  if (!fileId || typeof fileId !== "string") return json({})

  try {
    file = await getFileBuffer(fileId)
  } catch (error) {
    return json(
      { errors: { error } },
      { status: 400 }
    );
  }

  const fileStream = createReadableStreamFromReadable(
    Readable.from(file?.stream as Buffer),
  );

  const mimeTypesToExtensions: Record<string, string> = {
    'image/jpeg': '.jpeg',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  };

  const headers = new Headers();
  headers.set('Content-Type', file?.contentType ?? "image/jpeg");
  headers.set('Content-Disposition', `attachment; filename="${file?.name}-${file?.user.name}${mimeTypesToExtensions[file?.contentType ?? ""] || ""}"`);

  return new Response(fileStream, {
    status: 200,
    headers: headers
  });
};