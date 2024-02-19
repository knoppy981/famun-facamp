import { LoaderFunctionArgs, json } from "@remix-run/node"
import { listDelegates } from "~/models/delegate.server"
import { requireAdminId } from "~/session.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const query = url.searchParams.get("user-search") as string;
  let delegatesList

  try {
    delegatesList = (await listDelegates(query)).map(item => ({ name: item.user.name, id: item.id }))
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteComittee: "Failed searching users" } },
      { status: 400 }
    )
  }

  return json({ delegatesList })
}