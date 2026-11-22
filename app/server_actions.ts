'use server'

import axios from "axios";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(username: string, password: string) {
    let redirectPath: string | null = null;
    try {

        const response = await axios.post(`${process.env.BACKEND_BASE_URL}/auth/login`, 
            { username, password });
        console.log("login response data:", response.data);
        const cookieStore = await cookies();
        cookieStore.set("access", response.data.access, {secure: true, httpOnly: true, sameSite: "strict"});
        cookieStore.set("refresh", response.data.refresh, {secure: true, httpOnly: true, sameSite: "strict"});
        cookieStore.set("user", username); 
        redirectPath = '/stock-analysis';
    } catch (error: any) {
        console.log("login error:", error);
        console.log("login error.response.data.message:", error.response.data.message);
        return { error: error.response.data.message };
    } finally {
        if (redirectPath) {
            redirect(redirectPath);
        }
    }
}

export async function logout() {
    
    const cookieStore = await cookies();

    let redirectPath: string | null = null;
    try {
        await axios.post(`${process.env.BACKEND_BASE_URL}/auth/logout`, 
        { refresh: cookieStore.get("refresh")?.value });
        cookieStore.delete("access");
        cookieStore.delete("refresh");
        cookieStore.delete("user");
        redirectPath = '/login';
    } catch (error: any) {
        console.log("logout error:", error);
        return { error: error.message };
    } finally {
        if (redirectPath) {
            redirect(redirectPath);
        }
    }
}

export async function signup(username: string, email: string, password: string) {
    let redirectPath: string | null = null;
    try {
        const response = await axios.post(`${process.env.BACKEND_BASE_URL}/auth/signup`, 
            { username, email, password });
        console.log("signup response data:", response.data);

        redirectPath = '/login';
    } catch (error: any) {
        console.log("signup error:", error);
        console.log("signup error.response.data.message:", error.response.data.message);
        return { error: error.response.data.message };
    } finally {
        if (redirectPath) {
            redirect(redirectPath);
        }
    }
}

export async function checkAuth() {
    const cookieStore = await cookies();
    if(!cookieStore.has("access")) {
        redirect('/login');
    }
}

export async function getStockMetrics(stockId: string) {
    return getUrlWithAuth(`${process.env.BACKEND_BASE_URL}/stockMetrics?stockId=${stockId}`);
}

async function getUrlWithAuth(url: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access")?.value;
    if(accessToken == null) {
        return { error: "User is not authenticated"};
    }

    let redirectPath: string | null = null;
    try {
        const response = await axios.get(url, 
            { 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        console.log(`get ${url} response data:`, response.data);
        return { data: response.data };
    } catch (error: any) {
        console.log(`get ${url} response error:`, error);
        console.log(`get ${url} error.response.data:`, error.response.data);

        if (error.status == 401) {
            cookieStore.delete("access");
            cookieStore.delete("refresh");
            cookieStore.delete("user");
            redirectPath = "/login"
            return { error: error.response.data.message };
        }

        return { error: error.response.data.message };
    } finally {
        if (redirectPath) {
            console.log(`redirect page to ${redirectPath}`)
            redirect(redirectPath);
        }
    }
}