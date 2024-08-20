import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireAdminId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData()
  const id = formData.get("id") as string
  let date = new Date()

  try {
    let user = await prisma.user.update({
      where: {
        id
      },
      data: {
        presenceControl: {
          upsert: {
            set: {
              dailyCheckIn: [date.toLocaleString("pt-BR")]
            },
            update: {
              dailyCheckIn: {
                push: date.toLocaleString("pt-BR")
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.log(error)
  }

  return json({})
}