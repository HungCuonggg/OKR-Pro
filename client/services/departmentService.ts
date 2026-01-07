import { apiRequest } from './apiClient';

export async function getDepartments() {
  return apiRequest('/departments');
}

export async function createDepartment(data: { name: string; head?: string; description?: string }) {
  return apiRequest('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDepartment(id: string, data: { name?: string; head?: string; description?: string }) {
  return apiRequest(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDepartment(id: string) {
  return apiRequest(`/departments/${id}`, {
    method: 'DELETE'
  });
}
