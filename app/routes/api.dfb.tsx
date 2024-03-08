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

  const headers = new Headers();
  headers.set('Content-Type', 'image/jpeg');
  headers.set('Content-Disposition', `attachment; filename="${file?.name}-${file?.user.name}.jpeg"`);

  return new Response(fileStream, {
    status: 200,
    headers: headers
  });
};