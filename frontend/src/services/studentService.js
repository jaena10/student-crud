const BASE_URL = '/mangulabnan/students';

/**
 * Fetch all students from backend
 */
export async function getAllStudents() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch students (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
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
  const response = await fetch(BASE_URL, {
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
  const response = await fetch(`${BASE_URL}/${id}`, {
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
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to delete student #${id}`);
  }

  // Backend returns text message "Student with id X deleted."
  return response.text();
}
