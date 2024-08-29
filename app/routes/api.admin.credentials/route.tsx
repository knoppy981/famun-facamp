import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireAdminId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData()
  const id = formData.get("id") as string
  const isEntering = formData.get("isEntering") as string === "true"
  let date = new Date()

  try {
    let user = await prisma.user.update({
      where: {
        numericId: Number(id)
      },
      data: {
        presenceControl: {
          upsert: {
            set: {
              dailyCheckIn: [`${date.toLocaleString("pt-BR")}, ${isEntering ? "entrando" : "saindo"}`]
            },
            update: {
              dailyCheckIn: {
                push: `${date.toLocaleString("pt-BR")}, ${isEntering ? "entrando" : "saindo"}`
              }
            }
          }
        }
      },
    })

    console.log(user)

    return json({ user: { name} })
  } catch (error) {
    console.log(error)
  }

  return json({})
}