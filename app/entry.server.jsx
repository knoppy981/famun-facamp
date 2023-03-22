import { RemixServer } from "@remix-run/react";
import { ServerStyleSheet } from "styled-components";
import { Response } from "@remix-run/node";
import { resetServerContext } from "react-beautiful-dnd";
import { PassThrough, Transform } from "stream";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { resolve } from "node:path";
import isbot from "isbot";

import i18next from './i18n/i18n.server'
import i18n from './i18n/i18nextOptions'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import Backend from 'i18next-fs-backend'

const ABORT_DELAY = 5000

export default async function handleRequest(
	request,
	responseStatusCode,
	responseHeaders,
	remixContext
) {

	let callbackName = isbot(request.headers.get("user-agent"))
		? "onAllReady"
		: "onShellReady";

	let instance = createInstance();
	let lng = await i18next.getLocale(request);
	let ns = i18next.getRouteNamespaces(remixContext);

	console.log(ns)

	await instance
		.use(initReactI18next) // Tell our instance to use react-i18next
		.use(Backend) // Setup our backend
		.init({
			...i18n, // spread the configuration
			lng, // The locale we detected above
			ns, // The namespaces the routes about to render wants to use
			backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
		});


	const sheet = new ServerStyleSheet();

	let markup = renderToString(
		sheet.collectStyles(
			<I18nextProvider i18n={instance}>
				<RemixServer context={remixContext} url={request.url} />
			</I18nextProvider>
		)
	);

	const styles = sheet.getStyleTags();

	markup = markup.replace("__STYLES__", styles);

	responseHeaders.set("Content-Type", "text/html");

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}


/* 
let markup = renderToString(
	sheet.collectStyles(
		<I18nextProvider i18n={instance}>
			<RemixServer context={remixContext} url={request.url} />
		</I18nextProvider>
	)
);
const styles = sheet.getStyleTags();

markup = markup.replace("__STYLES__", styles);

responseHeaders.set("Content-Type", "text/html");

return new Response("<!DOCTYPE html>" + markup, {
	status: responseStatusCode,
	headers: responseHeaders,
}); 
*/
