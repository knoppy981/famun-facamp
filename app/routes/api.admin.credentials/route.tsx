import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireAdminId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData()
  const id = formData.get("id") as string
  const isEntering = formData.get("isEntering") as string === "true"
  let timeString = `${new Date().toLocaleString("pt-BR")}, ${isEntering ? "entrando" : "saindo"}`

  try {
    if (!Number(id)) throw new Error("Código inválido")

    let user = await prisma.user.update({
      where: {
        numericId: Number(id)
      },
      data: {
        presenceControl: {
          upsert: {
            set: {
              dailyCheckIn: [timeString]
            },
            update: {
              dailyCheckIn: {
                push: timeString
              }
            }
          }
        }
      },
      select: {
        name: true,
        delegation: {
          select: {
            school: true
          }
        }
      }
    })

    return json({ name: user.name, timeString, school: user.delegation?.school ?? "" })
  } catch (error: any) {
    console.dir(error, { depth: null })
    if (error.code === "P2025") {
      return json(
        { errors: { barCode: "Usuário não encontrado!" } },
        { status: 400 }
      );
    }
    return json(
      { errors: { barCode: error.message } },
      { status: 400 }
    );
  }
}