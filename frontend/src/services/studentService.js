/**
 * Determine API base URL dynamically:
 * 1. If VITE_API_BASE_URL is set (e.g. in Render build/environment), prepend it
 * 2. If running locally (localhost), use Vite proxy path '/mangulabnan/students'
 * 3. Default fallback to Render production backend
 */
export function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    return `${clean}/mangulabnan/students`;
  }

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '/mangulabnan/students';
  }

  return 'https://student-backend.onrender.com/mangulabnan/students';
}

/**
 * Fetch all students from backend
 */
export async function getAllStudents() {
  const url = getBaseUrl();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch students (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(id) {
  const url = `${getBaseUrl()}/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch student #${id}`);
  }
  return response.json();
}

/**
 * Create a new student
 * Payload: { firstname, lastname, course, section }
 */
export async function createStudent(studentData) {
  const url = getBaseUrl();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create student (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing student by ID
 * Payload: { firstname, lastname, course, section }
 */
export async function updateStudent(id, studentData) {
  const url = `${getBaseUrl()}/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update student #${id}`);
  }

  return response.json();
}

/**
 * Delete a student by ID
 */
export async function deleteStudent(id) {
  const url = `${getBaseUrl()}/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to delete student #${id}`);
  }

  // Backend returns text message "Student with id X deleted."
  return response.text();
}
