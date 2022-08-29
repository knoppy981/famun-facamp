import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components'

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return json({ userId });
};

const Index = () => {

	const data = useLoaderData()
	const user = useUser()


	return (
		<S.Wrapper>
			<S.Container>
				<S.Title>
					Famun 2023
				</S.Title>
				<S.Subtitle>
					Bem-vindo, <br /> {user.name}
				</S.Subtitle>
				<S.List>

					<S.ListItem>
						<S.ItemLink
							to="/payments"
						>
							Pagamentos
						</S.ItemLink>
					</S.ListItem>

					<S.ListItem>
						<S.ItemLink
							to="/payments"
						>
							Dados de Inscricão
						</S.ItemLink>
					</S.ListItem>

					<S.ListItem>
						<S.ItemLink
							to="/logout"
						>
							Logout
						</S.ItemLink>
					</S.ListItem>

				</S.List>
			</S.Container>
		</S.Wrapper>
	);
}

export default Index