import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return json({ userId });
};

export default function Index() {

	const data = useLoaderData()

  return (
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <p>
            FAMUN asdasd
          </p>
          <Link to="/logout">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
