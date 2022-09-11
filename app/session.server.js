import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from 'tiny-invariant'

import { getUserById } from "~/models/user.server";
import { getDelegationById } from "~/models/delegation.server"

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

  throw await logout(request);
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

  throw await logout(request);
}

export async function getDelegationId(request) {
  const session = await getSession(request);
  const delegationId = session.get(DELEGATION_SESSION_KEY);
  return delegationId;
}

export async function getDelegation(request) {
  const delegationId = await getDelegationId(request);
  if (delegationId === undefined) return null;

  const delegation = await getDelegationById(delegationId);
  if (delegation) return delegation;

  throw await logout(request);
}

export async function requireDelegationId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const delegationId = await getDelegationId(request);
  if (!delegationId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/dashboard/home/delegation/join?${searchParams}`);
  }
  return delegationId
}

export async function requireDelegation(request) {
  const delegationId = await requireDelegationId(request);

  const delegation = await getDelegationById(delegationId);
  if (delegation) return delegation;

  throw await logout(delegation);
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
        maxAge: undefined,
      }),
    },
  });
}

export async function createSignupSession({
	request,
  data,
	redirectTo
}) {
  const session = await getSession(request);
	data.map((item) => {
		session.set(item.key, item.value);
	})
	return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: undefined,
      }),
    },
  });
}

export async function getSignupSession({
	request,
	keys
}) {
	const session = await getSession(request);
	let items = []
	keys.map((item) => {
		items.push(session.get(item));
	})
  return items;
}

export async function logout(request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}