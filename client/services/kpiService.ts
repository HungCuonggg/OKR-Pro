import { apiRequest } from './apiClient';
import { KPI } from '../types';

export async function getKPIs(params?: {
    type?: string;
    department?: string;
    quarter?: string;
    year?: number;
    userId?: string;
}) {
    const qs = params
        ? `?${new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}))}`
        : '';
    return apiRequest(`/kpis${qs}`);
}

export async function getDepartmentKPIs(department: string): Promise<KPI[]> {
    return apiRequest(`/kpis/department/${department}`);
}

export async function getPersonalKPIs(userId: string): Promise<KPI[]> {
    return apiRequest(`/kpis/personal/${userId}`);
}

export async function createKPI(payload: Partial<KPI>): Promise<KPI> {
    return apiRequest('/kpis', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function getKPI(id: string): Promise<KPI> {
    return apiRequest(`/kpis/${id}`);
}

export async function updateKPI(id: string, payload: Partial<KPI>): Promise<KPI> {
    return apiRequest(`/kpis/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function updateKPIProgress(id: string, currentValue: number): Promise<KPI> {
    return apiRequest(`/kpis/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ currentValue })
    });
}

export async function deleteKPI(id: string): Promise<void> {
    return apiRequest(`/kpis/${id}`, { method: 'DELETE' });
}
