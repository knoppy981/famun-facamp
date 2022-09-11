import React from 'react'
import { Outlet, useLoaderData, NavLink } from '@remix-run/react';
import { json } from '@remix-run/node';

import { requireUserId, getDelegation } from '~/session.server';

import * as S from '~/styled-components/dashboard/sidebar'
import { BsPeople, BsCheck2Square, BsCurrencyDollar } from "react-icons/bs";

/* export const loader = async ({ request }) => {
	
}; */
const menu = () => {

	const sidebarData = [
		{
			title: "Delegação",
			to: `/dashboard/home/delegation`,
			icon: <BsPeople />,
			subItems: [
				{
					title: "Delegados",
					to: `/dashboard/home/delegation`
				}, {
					title: "Configuraçao da Delegação",
					to: `/dashboard/home/delegation/settings`
				}
			]
		},
		{
			title: "Dados da Inscrição",
			to: "/dashboard/home/subscription",
			icon: <BsCheck2Square />,
			subItems: [
				{
					title: "Editar Dados",
					to: "/dashboard/home/subscription"
				}, {
					title: "Documentos",
					to: "/dashboard/home/documents"
				}
			]
		},
		{
			title: "Pagamento",
			to: "/dashboard/home/payment",
			icon: <BsCurrencyDollar />,
			subItems: [
				{
					title: "Delegação",
					to: "/dashboard/home/payment"
				}, {
					title: "Indivídual",
					to: "/dashboard/home/payment"
				}
			]
		}
	]

return (
	<>
		<S.Sidebar>
			<S.ItemsWrapper>
				{sidebarData.map((item, index) => (
					<S.ItemContainer
						key={index}
					>
						<NavLink
							to={item.to}
							active={1}
							style={({ isActive }) =>
								isActive ? {
									color: "#E2D650",
									borderLeft: "3px solid #E2D650",
									background: "rgba(226, 214, 80, .4)",
									transition: "all 0.4 ease",
								} : {
									borderLeft: "3px solid rgba(0,0,0,0)"
								}
							}
						>
							<S.Item>
								{item.icon} {" "} {item.title}
							</S.Item>
						</NavLink>
						{item.subItems.map((item, index) => (
							<S.SubItem
								to={item.to}
								key={index}
							>
								{item.title}
							</S.SubItem>
						))}
					</S.ItemContainer>
				))}
			</S.ItemsWrapper>
		</S.Sidebar>

		<Outlet />

	</>
)
}

export default menu