export async function getStudentStats() {
    // This is a mock function. In a real application, you would fetch this data from your database.
    return {
      totalStudents: 15,
      courseDistribution: {
        "Computer Science": 50,
        "Business Administration": 40,
        "Electrical Engineering": 30,
        "Psychology": 30,
      },
    }
  }
  
  