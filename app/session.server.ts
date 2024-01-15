import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { UserType } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import type { Delegation } from "~/models/delegation.server";
import { getDelegationById } from "~/models/delegation.server"

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";
const DELEGATION_SESSION_KEY = "delegationId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request,
): Promise<UserType["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  delegationId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  delegationId?: string | undefined,
  remember?: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  if (delegationId) session.set(DELEGATION_SESSION_KEY, delegationId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getDelegationId(request: Request) {
  const session = await getSession(request);
  const delegationId = session.get(DELEGATION_SESSION_KEY);
  return delegationId;
}

export async function requireDelegationId(
  request: Request,
  redirectTo = new URL(request.url).pathname
) {
  const delegationId = await getDelegationId(request);
  if (!delegationId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/join/delegation?${searchParams}`);
  }
  return delegationId
}

export async function requireDelegation(request: Request) {
  const delegationId = await requireDelegationId(request);

  const delegation = await getDelegationById(delegationId);
  if (delegation) return delegation;

  throw await logout(request);
}