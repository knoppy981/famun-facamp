import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from 'tiny-invariant'

import { getUserById } from "~/models/user.server";
import { getDelegationById } from "~/models/delegation.server"
import { safeRedirect } from "~/utils"

invariant(process.env.SESSION_SECRET, 'session-secret must be set!!')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  }
})

const USER_SESSION_KEY = "userId";
const DELEGATION_SESSION_KEY = "delegationId"

export async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout({request});
}

export async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout({request});
}

export async function createUserSession({
  request,
  userId,
  delegationId,
  remember,
  redirectTo,
}) {
  const session = await getSession(request)
  if (userId) session.set(USER_SESSION_KEY, userId)
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

export async function logout({ request, redirectTo }) {
  console.log(redirectTo)
  const _safeRedirect = safeRedirect(redirectTo)
  console.log(_safeRedirect)
  const session = await getSession(request);
  return redirect(_safeRedirect, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getDelegationId(request) {
  const session = await getSession(request);
  const delegationId = session.get(DELEGATION_SESSION_KEY);
  return delegationId;
}

export async function requireDelegationId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const delegationId = await getDelegationId(request);
  if (!delegationId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/join/delegation?${searchParams}`);
  }
  return delegationId
}

export async function requireDelegation(request) {
  const delegationId = await requireDelegationId(request);

  const delegation = await getDelegationById(delegationId);
  if (delegation) return delegation;

  throw await logout({delegation});
}