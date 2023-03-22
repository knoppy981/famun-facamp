import { RemixServer } from "@remix-run/react";
import { ServerStyleSheet } from "styled-components";
import { Response } from "@remix-run/node";
import { resetServerContext } from "react-beautiful-dnd";
import { PassThrough, Transform } from "stream";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { resolve } from "node:path";
import isbot from "isbot";

import i18next from './i18n/i18n.server'
import i18nextOptions from './i18n/i18nextOptions'
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

	const instance = createInstance()

	// Then we could detect locale from the request
	const lng = await i18next.getLocale(request)
	// And here we detect what namespaces the routes about to render want to use
	const ns = i18next.getRouteNamespaces(remixContext)

	resetServerContext()

	// First, we create a new instance of i18next so every request will have a
	// completely unique instance and not share any state.
	await instance
		.use(initReactI18next) // Tell our instance to use react-i18next
		.use(Backend) // Setup our backend.init({
		.init({
			...i18nextOptions, // use the same configuration as in your client side.
			lng, // The locale we detected above
			ns, // The namespaces the routes about to render want to use
			backend: {
				loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
			}
		})

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
