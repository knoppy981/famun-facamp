import React from 'react'
import qs from "qs"
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { getFileBuffer } from '~/models/file.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const text = await request.text()
  const data = JSON.parse(text);

  const fileId = data?.fileId
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

  const headers = new Headers();
  headers.set('Content-Type', 'image/jpeg');
  headers.set('Content-Disposition', 'inline');

  return new Response(file?.stream, {
    status: 200,
    headers: headers
  });
}