import React from 'react'
import {Objeto, LoginForm} from "~/stylecomponents"
import { json } from '@remix-run/node'
import { verifyLogin } from '~/models/user.server'
import { createUserSession } from '~/session.server'

export const action = async ({request}) => {
    const formData=await request.formData()
    const email=formData.get("email")
    const password=formData.get("password")
    if(typeof password !== "string" || password.length === 0){
        return json(
            {error: {password: "Senha Inválida!"}},
            {status: 404}
        )
    }
    const user=await verifyLogin(email, password)
    if(!user){
        return json(
            {error: {password: "Senha e User não correspondem!"}},
            {status: 404}
        )
    }
    return createUserSession({
        request, 
        userId: user.id,
        remember: true,
        redirectTo: "/",
    })
}

const login = () => {
  return (
    <Objeto>
        <LoginForm
        method="post" //importante
        >
            <input
             type="email"
             name="email"
             id="email"
             placeholder='Seu Email:'
            >
                
            </input>
            <input
             type="password"
             name="password"
             id="password"
             placeholder='Sua Senha:'
            >
                
            </input>
            <button
            type="submit" //importante
            >
                Submit
            </button>
        </LoginForm>
    </Objeto>
  )
}

export default login