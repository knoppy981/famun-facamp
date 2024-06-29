import React from "react";

import Button from "~/components/button";
import { FiDownload, FiExternalLink } from "react-icons/fi/index.js";
import Link from "~/components/link";
import { UserType } from "~/models/user.server";
import { Notifications } from "@prisma/client";

const Documents = ({ participant }: { participant: UserType & { notifications?: Notifications[] } }) => {
  if (participant.files?.length === 0) return (
    <div className="text italic">
      Nenhum documento recebido ainda...
    </div>
  )

  return (
    <div>
      {participant.files?.map((item, index) => <Document file={item} key={index} i={index} />)}
    </div>
  )
}

const Document = ({ file, i }: {
  file: {
    id?: string;
    userId?: string;
    url?: string | null;
    name?: string;
    fileName?: string;
    stream?: Buffer;
    size?: number;
    createdAt?: Date;
  }, i: number
}) => {
  return (
    <div className={`admin-delegation-notification ${i !== 0 ? "border" : ""}`}>
      <p className="text">
        {file.name}
      </p>

      <p className="text italic">{file.fileName} {file.size ? " - " + formatBytes(file.size) : null}</p>

      <div className="admin-delegation-documents-buttons-container">
        <Button
          onPress={() => handleFileView(file.id as string)}
          className="secondary-button-box blue-dark"
        >
          <FiExternalLink className="icon" /> Visualizar
        </Button>

        <Link
          to={`/api/admin/file/download?fileId=${file.id}`}
          reloadDocument
          className="secondary-button-box green-dark link"
        >
          <div className='button-child'>
            <FiDownload className="icon" /> Baixar
          </div>
        </Link>
      </div>
    </div>
  )
}

async function handleFileView(fileId: string) {
  try {
    const response = await fetch('/api/admin/file/getBuffer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    window.open(imageUrl, '_blank');
  } catch (error) {
    console.error('Error fetching the image:', error);
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default Documents