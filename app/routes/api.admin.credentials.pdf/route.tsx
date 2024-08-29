import { json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireAdminId } from "~/session.server";
import { Page, Text, View, Document, StyleSheet, Font, renderToStream } from '@react-pdf/renderer';
import path from "path";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)

  try {
    let users = await getAllUsers()

    // render the PDF as a stream so you do it async
    let stream = await renderToStream(<PDFDocument users={users} />);

    // and transform it to a Buffer to send in the Response
    let body: Buffer = await new Promise((resolve, reject) => {
      let buffers: Uint8Array[] = [];
      stream.on("data", (data) => {
        buffers.push(data);
      });
      stream.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      stream.on("error", reject);
    });

    // finally create the Response with the correct Content-Type header for
    // a PDF
    let headers = new Headers({ "Content-Type": "application/pdf" });
    return new Response(body, { status: 200, headers });
  } catch (error) {
    console.log(error)
    return json({})
  }
}

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      name: true,
      numericId: true
    },
    orderBy: {
      name: "asc"
    }
  })
}

// Register the barcode font
Font.register({
  family: 'Barcode39',
  src: path.join(process.cwd(), "public", "fonts", "3OF9_NEW.TTF"),
});

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    display: "flex",
  },
  section: {
    marginBottom: 20,
  },
  barcode: {
    fontFamily: 'Barcode39',
    fontSize: 28,
    marginTop: 5,
  },
  text: {
    fontSize: 16,
  },
});

// Define the PDF Document
const PDFDocument = ({ users }: { users: { name: string; numericId: number | null }[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {users.map((user, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.barcode}>*{user.numericId}*</Text>
        </View>
      ))}
    </Page>
  </Document>
);
