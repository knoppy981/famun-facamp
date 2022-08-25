import { logout } from "~/session.server";

export const loader=async({request}) => {
    return logout(request);
}