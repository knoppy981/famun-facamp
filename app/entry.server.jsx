import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { createInstance } from 'i18next'
import { resolve } from 'node:path'
import i18next from './i18n/i18n.server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import Backend from 'i18next-fs-backend'
import i18n from './i18n'
import { resetServerContext } from "react-beautiful-dnd";

export default async function handleRequest(
	request,
	responseStatusCode,
	responseHeaders,
	remixContext
) {
	resetServerContext()
	
	let instance = createInstance();
  let lng = await i18next.getLocale(request);
  let ns = i18next.getRouteNamespaces(remixContext);

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