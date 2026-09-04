'use server';

import {cookies} from 'next/headers';
import {NextResponse} from "next/server";

const API_BASE_URL = 'http://localhost:8000'; // Update this if your backend is hosted on a different domain/port

async function request(endpoint, options = {}, searchParams = Promise.resolve()) {
    const resolvedParams = await searchParams;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // 2. Construct the URL and append the search parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (resolvedParams) {
        Object.entries(resolvedParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(key, v));
                } else {
                    url.searchParams.append(key, String(value));
                }
            }
        });
    }
    const externalResponse = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
            Cookie: `token=${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        credentials: 'include',
        ...options
    });

    const data = await externalResponse.json();

    const setCookieHeader = externalResponse.headers.get('set-cookie');

    const response = NextResponse.json(data, {
        status: externalResponse.status,
    });

    if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
    }

    return data;
}

export async function loginUser(credentials) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
}

export async function registerUser(userData) {
    return request('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

export async function getAssets(searchParams) {
    return request('/assets', {
            method: 'GET'
        },
        searchParams
    );
}

export async function getMyAssets() {
    return request('/my-assets', {method: 'GET'});
}

export async function createAsset(assetData) {
    return request('/my-assets', {
        method: 'POST',
        body: JSON.stringify(assetData)
    });
}

export async function getMyAsset(id) {
    return request(`/my-assets/${encodeURIComponent(id)}`, {method: 'GET'});
}

export async function updateAsset(id, assetData) {
    return request(`/my-assets/${encodeURIComponent(id)}`, {method: 'PUT', body: JSON.stringify(assetData)});
}
